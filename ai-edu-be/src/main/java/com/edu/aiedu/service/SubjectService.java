package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.SubjectDTO;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.entity.Subject;
import com.edu.aiedu.repository.SchoolRepository;
import com.edu.aiedu.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
}
