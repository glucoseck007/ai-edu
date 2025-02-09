package com.edu.aiedu.repository;

import com.edu.aiedu.entity.AccountClassroom;
import com.edu.aiedu.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountClassroomRepository extends JpaRepository<AccountClassroom, Long> {

    @Query("SELECT ac.classroom FROM AccountClassroom ac WHERE ac.account.id = :accountId")
    List<Classroom> findClassroomsByAccountId(@Param("accountId") String accountId);
}
