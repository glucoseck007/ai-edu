package com.edu.aiedu.repository;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    List<Classroom> findByAccount(Account account);
}
