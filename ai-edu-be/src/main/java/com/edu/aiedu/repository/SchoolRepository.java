package com.edu.aiedu.repository;

import com.edu.aiedu.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {

    Optional<School> findBySchoolCode(String schoolCode);
    boolean existsBySchoolCode(String schoolCode);
}
