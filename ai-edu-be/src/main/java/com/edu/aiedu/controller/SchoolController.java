package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.SchoolDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.repository.SchoolRepository;
import com.edu.aiedu.service.ExternalApiService;
import com.edu.aiedu.service.SchoolService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/school")
public class SchoolController {

    private static final Logger logger = LoggerFactory.getLogger(SchoolController.class);
    private final SchoolService schoolService;
    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @Autowired
    private ExternalApiService externalApiService;

    @PostMapping("/add_school")
    public ResponseEntity<?> addSchool(@RequestBody SchoolDTO schoolDTO) {
        logger.info(schoolDTO.toString());
        try {
            School savedSchool = schoolService.addSchool(schoolDTO);
            SchoolDTO responseDTO = new SchoolDTO(
                    savedSchool.getSchoolCode(),
                    savedSchool.getSchoolName()
            );
            externalApiService.callExternalAddSchoolAPI(responseDTO);
            return ResponseEntity.ok(savedSchool);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error uploading content: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove_school/{school_code}")
    public ResponseEntity<?> removeSchool(@PathVariable String school_code) {
        logger.info(school_code);
        try {
            schoolService.deleteSchool(school_code);
            externalApiService.callExternalDeleteSchoolAPI(school_code);
            return ResponseEntity.ok("Delete successfully " + school_code);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete school: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Page<SchoolDTO>> getAllSchools(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(schoolService.getAllSchools(page, size));
    }
}
