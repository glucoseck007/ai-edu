package com.edu.aiedu.repository;

import com.edu.aiedu.entity.ClassroomContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClassroomContentRepository extends JpaRepository<ClassroomContent, String> {
    List<ClassroomContent> findByClassroomId(String classroomId);
    @Query("SELECT cc FROM ClassroomContent cc WHERE cc.classroom.id IN " +
            "(SELECT c.id FROM Classroom c WHERE c.classroomCode = :classroomCode)")
    List<ClassroomContent> findByClassroomCode(String classroomCode);
}
