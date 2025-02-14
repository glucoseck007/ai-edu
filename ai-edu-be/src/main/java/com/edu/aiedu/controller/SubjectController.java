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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
