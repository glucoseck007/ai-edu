package com.edu.aiedu.repository;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    Classroom findClassroomById(String id);
    List<Classroom> findClassroomByAccountId(String accountId);
    List<Classroom> findByAccount(Account account);
    boolean existsByClassroomCode(String classroomCode);
    Optional<Classroom> findByClassroomCode(String classroomCode);
    List<Classroom> findByAccountIdAndClassroomCode(String accountId, String classroomCode);
}
