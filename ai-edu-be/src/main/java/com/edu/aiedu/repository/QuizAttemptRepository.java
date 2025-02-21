package com.edu.aiedu.repository;

import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByAccountIdAndQuizId(String accountId, Long quizId);
    List<QuizAttempt> findByQuizIdAndAccountId(Long quizId, String accountId);
    List<QuizAttempt> findByAccountId(String accountId);
}
