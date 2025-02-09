package com.edu.aiedu.repository;

import com.edu.aiedu.entity.ClassroomContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassroomContentRepository extends JpaRepository<ClassroomContent, String> {
    List<ClassroomContent> findByClassroomId(String classroomId);
}
