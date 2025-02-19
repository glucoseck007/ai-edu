package com.edu.aiedu.repository;

import com.edu.aiedu.dto.ai.ListClassMembersDTO;
import com.edu.aiedu.entity.AccountClassroom;
import com.edu.aiedu.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountClassroomRepository extends JpaRepository<AccountClassroom, Long> {

    @Query("SELECT ac.classroom FROM AccountClassroom ac WHERE ac.account.id = :accountId")
    List<Classroom> findClassroomsByAccountId(@Param("accountId") String accountId);

//    @Query("SELECT new com.edu.aiedu.dto.ai.AccountClassroomQuizDTO(a.id, c.classroomCode, q.id) " +
//            "FROM AccountClassroom ac " +
//            "JOIN ac.classroom c " +
//            "JOIN ac.account a " +
//            "JOIN Quiz q ON q.classCode = c.classroomCode")
//    List<AccountClassroomQuizDTO> findAccountClassroomQuizzes();

    @Query(value = "SELECT a.id AS accountId, c.classroom_code AS classroomCode, q.id AS quizId " +
            "FROM account_classroom ac " +
            "JOIN classroom c ON ac.classroom_id = c.id " +
            "JOIN account a ON ac.account_id = a.id " +
            "JOIN quizzes q ON q.class_code = c.classroom_code",
            nativeQuery = true)
    List<Object[]> findAccountClassroomQuizzesNative();

    @Query("""
        SELECT new com.edu.aiedu.dto.ai.ListClassMembersDTO(a.id, a.firstName, a.lastName, a.email)
        FROM AccountClassroom ac
        JOIN ac.classroom c
        JOIN ac.account a
        WHERE c.classroomCode = :classroomCode
    """)
    List<ListClassMembersDTO> findClassMembersByClassroomCode(@Param("classroomCode") String classroomCode);
}
