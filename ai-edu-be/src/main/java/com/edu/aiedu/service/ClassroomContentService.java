package com.edu.aiedu.service;

import com.edu.aiedu.dto.request.ClassroomContentDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.entity.ClassroomContent;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.ClassroomContentRepository;
import com.edu.aiedu.repository.ClassroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClassroomContentService {

    private final ClassroomContentRepository contentRepository;
    private final ClassroomRepository classroomRepository;

    private static final String UPLOAD_DIR = "uploads/";  // Folder to store files
    private final AccountRepository accountRepository;

    @Autowired
    public ClassroomContentService(ClassroomContentRepository contentRepository, ClassroomRepository classroomRepository, AccountRepository accountRepository) {
        this.contentRepository = contentRepository;
        this.classroomRepository = classroomRepository;
        this.accountRepository = accountRepository;
    }

    public ClassroomContent uploadContent(String classroomId, String title, String content,
                                          byte[] fileData, String fileName, String fileType) {
        Classroom classroom = classroomRepository.findById(classroomId)
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        ClassroomContent classroomContent = ClassroomContent.builder()
                .title(title)
                .content(content)
                .fileData(fileData)     // Save the file data directly in DB
                .fileName(fileName)
                .fileType(fileType)
                .classroom(classroom)
                .build();

        return contentRepository.save(classroomContent);
    }

    public List<ClassroomContentDTO> getContentByClassroomId(String classroomId) {
        List<ClassroomContent> contents = contentRepository.findByClassroomId(classroomId);


        return contents.stream().map(content -> ClassroomContentDTO.builder()
                .title(content.getTitle())
                .content(content.getContent())
//                .fileData(content.getFileData())  // Return the file data as a byte array
                .fileName(content.getFileName())  // Optional: Include the file name
                .fileType(content.getFileType())  // Optional: Include the file type (MIME)
                .classroomId(classroomId)
                        .createdDate(content.getCreatedDate())
                .build()
        ).collect(Collectors.toList());
    }

    public Optional<ClassroomContent> getContentById(String contentId) {
        return contentRepository.findById(contentId);
    }

    public List<ClassroomContentDTO> getClassroomContentByClassroomCode(String classroomCode) {
        List<ClassroomContent> contentList = contentRepository.findByClassroomCode(classroomCode);

        return contentList.stream().map(content ->
                ClassroomContentDTO.builder()
//                        .id(content.getId())
                        .title(content.getTitle())
                        .content(content.getContent())
                        .fileName(content.getFileName())
                        .fileType(content.getFileType())
                        .classroomId(content.getClassroom().getId())
                        .createdDate(content.getCreatedDate())
                        .build()
        ).collect(Collectors.toList());
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
                .createdDate(LocalDateTime.now())
                .build();

        return contentRepository.save(content);
    }

    public List<ClassroomContentDTO> getClassroomContentByClassroomId(String classroomId) {
        List<ClassroomContent> contentList = contentRepository.findByClassroomId(classroomId);

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
