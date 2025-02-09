package com.edu.aiedu.service;

import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.ClassroomRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Random;

@Service
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public ClassroomService(ClassroomRepository classroomRepository, AccountRepository accountRepository) {
        this.classroomRepository = classroomRepository;
        this.accountRepository = accountRepository;
    }

    public Classroom addClass(ClassroomDTO classroomDTO) {
        Account account = accountRepository.findById(classroomDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Classroom classroom = Classroom.builder()
                .name(classroomDTO.getName())
                .section(classroomDTO.getSection())
                .subject(classroomDTO.getSubject())
                .room(classroomDTO.getRoom())
                .account(account)
                .classroomCode(generateUniqueClassroomCode())
                .build();

        return classroomRepository.save(classroom);
    }

    public List<ClassroomDTO> getClassesByAccountId(String accountId) {
        List<Classroom> classrooms = classroomRepository.findClassroomByAccountId(accountId);

        return classrooms.stream().map(classroom -> new ClassroomDTO(
                classroom.getId(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                accountId,
                classroom.getClassroomCode()
        )).toList();
    }

    public ClassroomDTO getClassById(String id) {
        Classroom classroom = classroomRepository.findClassroomById(id);

        return classroom != null ? new ClassroomDTO(
                classroom.getId(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                classroom.getAccount().getId(),
                classroom.getClassroomCode()
        ) : null;
    }

    public List<ClassroomDTO> getAllClasses() {
        List<Classroom> classrooms = classroomRepository.findAll();

        return classrooms.stream().map(classroom -> new ClassroomDTO(
                classroom.getId(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                classroom.getAccount().getId(),
                classroom.getClassroomCode()
        )).toList();
    }

    private String generateUniqueClassroomCode() {
        String characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        String code;

        do {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                int index = random.nextInt(characters.length());
                result.append(characters.charAt(index));
            }
            code = result.toString();
        } while (classroomRepository.existsByClassroomCode(code));

        return code;
    }
}
