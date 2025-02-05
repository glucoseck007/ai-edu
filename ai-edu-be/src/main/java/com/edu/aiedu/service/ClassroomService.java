package com.edu.aiedu.service;

import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.ClassroomRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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
        // Fetch the Account associated with the given accountId
        Account account = accountRepository.findById(classroomDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Create and save the Classroom entity
        Classroom classroom = Classroom.builder()
                .name(classroomDTO.getName())
                .section(classroomDTO.getSection())
                .subject(classroomDTO.getSubject())
                .room(classroomDTO.getRoom())
                .account(account) // Associate the account
                .build();

        return classroomRepository.save(classroom);
    }

    public List<ClassroomDTO> getClassesByAccountId(String accountId) {
        // Check if the account exists
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));

        // Retrieve classrooms associated with the account
        List<Classroom> classrooms = classroomRepository.findByAccount(account);

        // Convert the entity list to DTO list
        return classrooms.stream().map(classroom -> new ClassroomDTO(
                classroom.getId(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                accountId
        )).toList();
    }


    public List<ClassroomDTO> getAllClasses() {
        List<Classroom> classrooms = classroomRepository.findAll();

        return classrooms.stream().map(classroom -> new ClassroomDTO(
                classroom.getId(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                classroom.getAccount().getId() // Avoids full serialization of Account
        )).toList();
    }

}
