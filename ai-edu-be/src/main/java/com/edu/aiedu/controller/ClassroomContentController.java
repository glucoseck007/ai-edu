package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.ClassroomContentDTO;
import com.edu.aiedu.dto.request.ClassroomContentUploadRequest;
import com.edu.aiedu.entity.ClassroomContent;
import com.edu.aiedu.service.ClassroomContentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

import java.util.List;

@RestController
@RequestMapping("/api/classroom-content")
public class ClassroomContentController {

    private static final Logger logger = LoggerFactory.getLogger(ClassroomContentController.class);

    private final ClassroomContentService contentService;

    @Autowired
    public ClassroomContentController(ClassroomContentService contentService) {
        this.contentService = contentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadContent(@RequestBody ClassroomContentUploadRequest request) {
        logger.info("Received upload request: {}", request); // Log the incoming request

        try {
            ClassroomContent savedContent = contentService.uploadContent(
                    request.getClassroomId(),
                    request.getTitle(),
                    request.getContent(),
                    request.getFileData() != null ? request.getFileData() : new byte[0],
                    request.getFileName(),
                    request.getFileType()
            );

            logger.info("Successfully saved content with ID: {}", savedContent.getId());
            return ResponseEntity.ok(savedContent);

        } catch (Exception e) {
            logger.error("Error uploading content: ", e); // Detailed error log
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error uploading content: " + e.getMessage());
        }
    }

    @GetMapping("/download/{contentId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String contentId) {
        ClassroomContent content = contentService.getContentById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        byte[] fileData = content.getFileData();
        String fileName = content.getFileName() != null ? content.getFileName() : "downloaded_file";

        if (fileData == null || fileData.length == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(new ByteArrayResource(fileData));
    }

    @GetMapping("/classroom")
    public ResponseEntity<List<ClassroomContentDTO>> getContentByClassroomId(
            @RequestParam("classroomId") String classroomId
    ) {
        List<ClassroomContentDTO> contents = contentService.getContentByClassroomId(classroomId);
        return ResponseEntity.ok(contents);
    }
}
