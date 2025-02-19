package com.edu.aiedu.repository;

import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.dto.ai.QuizDTO;
import com.edu.aiedu.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, String> {
    Optional<Quiz> findById(Long id);
    List<Quiz> findByAccountId(String accountId);
    List<Quiz> findByClassCode(String classCode);
    List<Quiz> findByAccountIdAndClassCode(String accountId, String classCode);
    List<Quiz> findByAccountIdAndClassCodeIsNull(String accountId);
    @Query("SELECT new com.edu.aiedu.dto.ai.QuizDTO(q.id, q.title, q.classCode) " +
            "FROM Quiz q " +
            "JOIN Classroom c ON q.classCode = c.classroomCode " +
            "JOIN AccountClassroom ac ON ac.classroom.id = c.id " +
            "JOIN ac.account a " +
            "WHERE a.id = :accountId AND c.classroomCode = :classCode")
    List<QuizDTO> findQuizzesByAccountIdAndClassCode(@Param("accountId") String accountId,
                                                     @Param("classCode") String classCode);
}
