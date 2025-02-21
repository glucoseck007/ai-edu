package com.edu.aiedu.repository;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    Classroom findClassroomById(String id);
    Classroom findSchoolCodeByClassroomCode(String classroomCode);
    Optional<Classroom> findClassroomByName(String name);
    Optional<Classroom> findClassroomByClassroomCode(String classCode);
    Optional<Classroom> findByNameAndSchool(String className, School school);
    List<Classroom> findClassroomByAccountId(String accountId);
    List<Classroom> findByAccount(Account account);
    boolean existsByClassroomCode(String classroomCode);
    Optional<Classroom> findByClassroomCode(String classroomCode);
    List<Classroom> findByAccountIdAndClassroomCode(String accountId, String classroomCode);
    void deleteClassroomByNameAndSchool(String classroomName, School school);
}
