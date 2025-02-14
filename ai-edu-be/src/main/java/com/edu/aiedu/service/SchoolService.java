package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.SchoolDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    public School addSchool(SchoolDTO schoolDTO) {
        // Create a new School entity
        School school = School.builder()
                .schoolName(schoolDTO.getSchool_name())
                .schoolCode(schoolDTO.getSchool_code())
                .build();

        // Save to the database
        return schoolRepository.save(school);
    }

    public void deleteSchool(String schoolCode) {
        Optional<School> schoolOptional = schoolRepository.findBySchoolCode(schoolCode);
        if (schoolOptional.isPresent()) {
            School school = schoolOptional.get();
            schoolRepository.delete(school);
        } else {
            throw new EntityNotFoundException("School with code " + schoolCode + " not found");
        }
    }
}
