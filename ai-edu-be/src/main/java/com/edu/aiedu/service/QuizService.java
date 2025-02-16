package com.edu.aiedu.service;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.QuizRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;
    @Autowired
    private AccountRepository accountRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional
    public Quiz saveQuiz(Quiz quiz) {
        // Ensure all questions are linked to this quiz before saving
        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
        return quizRepository.save(quiz);
    }

    @Transactional
    public Quiz saveQuiz(Quiz quiz, String accountId) {
        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        quiz.setAccount(account);
        return quizRepository.save(quiz);
    }
}
