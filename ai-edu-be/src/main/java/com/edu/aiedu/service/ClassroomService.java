package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.ListClassMembersDTO;
import com.edu.aiedu.dto.request.ClassroomContentDTO;
import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.entity.ClassroomContent;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.ClassroomContentRepository;
import com.edu.aiedu.repository.ClassroomRepository;
import com.edu.aiedu.repository.SchoolRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    private final SchoolRepository schoolRepository;
    private final ClassroomRepository classroomRepository;
    private final AccountRepository accountRepository;
    private final ClassroomContentRepository classroomContentRepository;

    @Autowired
    public ClassroomService(ClassroomRepository classroomRepository, AccountRepository accountRepository, SchoolRepository schoolRepository, ClassroomContentRepository classroomContentRepository) {
        this.classroomRepository = classroomRepository;
        this.accountRepository = accountRepository;
        this.schoolRepository = schoolRepository;
        this.classroomContentRepository = classroomContentRepository;
    }

    public Classroom getSchoolCodeByClassroomCode(String classroomCode) {
        return classroomRepository.findSchoolCodeByClassroomCode(classroomCode);
    }

    public Optional<Classroom> getClassroomByClassCode(String classCode) {
        return classroomRepository.findClassroomByClassroomCode(classCode);
    }

    public Classroom addClass(ClassroomDTO classroomDTO) {
        Account account = accountRepository.findById(classroomDTO.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        Optional<School> school = schoolRepository.findBySchoolCode(classroomDTO.getSchoolCode());

        Classroom classroom = Classroom.builder()
                .name(classroomDTO.getName())
                .section(classroomDTO.getSection())
                .subject(classroomDTO.getSubject())
                .room(classroomDTO.getRoom())
                .account(account)
                .classroomCode(generateUniqueClassroomCode())
                .school(school.get())
                .build();

        return classroomRepository.save(classroom);
    }

    public List<ClassroomDTO> getClassesByAccountId(String accountId) {
        List<Classroom> classrooms = classroomRepository.findClassroomByAccountId(accountId);

        return classrooms.stream().map(classroom -> new ClassroomDTO(
                classroom.getId(),
                classroom.getSchool().getSchoolCode(),
                classroom.getName(),
                classroom.getSection(),
                classroom.getSubject(),
                classroom.getRoom(),
                accountId,
                classroom.getClassroomCode()
        )).toList();
    }

    @Transactional
    public void deleteClassroom(String schoolCode, String className) {
        Optional<School> schoolOpt = schoolRepository.findBySchoolCode(schoolCode);

        if (schoolOpt.isPresent()) {
            Optional<Classroom> classroomOpt = classroomRepository.findByNameAndSchool(className, schoolOpt.get());

            if (classroomOpt.isPresent()) {
                classroomRepository.delete(classroomOpt.get());  // EntityManager remove() is called here
            } else {
                throw new RuntimeException("Classroom not found");
            }
        } else {
            throw new RuntimeException("School not found");
        }
    }

    public List<ClassroomDTO> getClassroomsByAccountId(String accountId) {
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            throw new RuntimeException("Account not found");
        }
        Account account = accountOpt.get();
        return account.getClassrooms().stream()
                .map(classroom -> ClassroomDTO.builder()
                        .id(classroom.getId())
                        .name(classroom.getName())
                        .subject(classroom.getSubject())
                        .section(classroom.getSection())
                        .room(classroom.getRoom())
                        .build())
                .collect(Collectors.toList());
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

    @Transactional
    public void addAccountToClassroom(String accountId, String classroomCode) {
        Optional<Account> accountOpt = accountRepository.findById(accountId);
        Optional<Classroom> classroomOpt = classroomRepository.findByClassroomCode(classroomCode);

        if (accountOpt.isEmpty()) {
            throw new RuntimeException("Account not found with ID: " + accountId);
        }
        if (classroomOpt.isEmpty()) {
            throw new RuntimeException("Classroom not found with code: " + classroomCode);
        }

        Account account = accountOpt.get();
        Classroom classroom = classroomOpt.get();

        if (classroom.getMembers().contains(account)) {
            throw new RuntimeException("Account already joined this classroom.");
        }

        // Add account to classroom members
        classroom.getMembers().add(account);
        account.getJoinedClassrooms().add(classroom);

        // Save both entities to maintain consistency
        classroomRepository.save(classroom);
        accountRepository.save(account);
    }

    public ClassroomContent saveClassroomContent(ClassroomContentDTO dto) {
        Optional<Classroom> classroomOptional = classroomRepository.findById(dto.getClassroomId());
        if (classroomOptional.isEmpty()) {
            throw new IllegalArgumentException("Classroom not found");
        }

        Classroom classroom = classroomOptional.get();
        ClassroomContent content = ClassroomContent.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .fileData(dto.getFileData())
                .fileName(dto.getFileName())
                .fileType(dto.getFileType())
                .classroom(classroom)
                .build();

        return classroomContentRepository.save(content);
    }

    public List<ClassroomContentDTO> getClassroomContentByClassroomId(String classroomId) {
        List<ClassroomContent> contentList = classroomContentRepository.findByClassroomId(classroomId);

        return contentList.stream().map(content ->
                ClassroomContentDTO.builder()
//                        .id(content.getId())
                        .title(content.getTitle())
                        .content(content.getContent())
                        .fileName(content.getFileName())
                        .fileType(content.getFileType())
                        .classroomId(classroomId)
                        .build()
        ).collect(Collectors.toList());
    }
}
