package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.SchoolDTO;
import com.edu.aiedu.dto.ai.SubjectDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.entity.Subject;
import com.edu.aiedu.repository.SchoolRepository;
import com.edu.aiedu.service.ExternalApiService;
import com.edu.aiedu.service.SubjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subject")
public class SubjectController {

    private static final Logger logger = LoggerFactory.getLogger(Subject.class);

    @Autowired
    private final SubjectService subjectService;
    @Autowired
    private ExternalApiService externalApiService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping("/list")
    public ResponseEntity<Page<SubjectDTO>> getAllSchools(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(subjectService.getAllSubjects(page, size));
    }

    @PostMapping("/add_subject")
    public ResponseEntity<?> addSubject(@RequestBody SubjectDTO subjectDTO) {
        logger.info("add_subject");
        try {
            subjectService.addSubject(subjectDTO);
            externalApiService.callExternalAddSubject(subjectDTO);
            return ResponseEntity.ok().body(subjectDTO);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error uploading content: " + e.getMessage());
        }
    }
}
