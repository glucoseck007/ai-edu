package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.SchoolDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    public Page<SchoolDTO> getAllSchools(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<School> schoolPage = schoolRepository.findAll(pageable);

        // Convert to DTO
        List<SchoolDTO> schoolDTOs = schoolPage.getContent().stream()
                .map(school -> new SchoolDTO(school.getSchoolName(), school.getSchoolCode()))
                .collect(Collectors.toList());

        return new PageImpl<>(schoolDTOs, pageable, schoolPage.getTotalElements());
    }
}
