package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.SubjectDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.entity.Subject;
import com.edu.aiedu.repository.SchoolRepository;
import com.edu.aiedu.repository.SubjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    SubjectRepository subjectRepository;
    SchoolRepository schoolRepository;

    public SubjectService(SubjectRepository subjectRepository, SchoolRepository schoolRepository) {
        this.subjectRepository = subjectRepository;
        this.schoolRepository = schoolRepository;
    }

    public Subject addSubject(SubjectDTO subjectDTO) {
        Optional<School> school = schoolRepository.findBySchoolCode(subjectDTO.getSchool_code());
        if (school.isPresent()) {
            Subject subject = new Subject();
            subject.setSchool(school.get());
            subject.setSubject_code(subjectDTO.getSubject_code());
            subjectRepository.save(subject);
            return subject;
        } else {
            return null;
        }
    }

    public Page<SubjectDTO> getAllSubjects(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Subject> subjectPage = subjectRepository.findAll(pageable);

        // Convert to DTO
        List<SubjectDTO> subjectDTOS = subjectPage.getContent().stream()
                .map(subject -> new SubjectDTO(subject.getSubject_code(), subject.getSchool().getSchoolCode()))
                .collect(Collectors.toList());

        return new PageImpl<>(subjectDTOS, pageable, subjectPage.getTotalElements());
    }
}
