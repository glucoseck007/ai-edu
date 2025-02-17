package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.QuestionDTO;
import com.edu.aiedu.dto.ai.QuizDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.QuizRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public Quiz saveQuiz(Quiz quiz, String accountId, String subject, String title) {
        for (Question question : quiz.getQuestions()) {
            question.setQuiz(quiz);
        }
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));
        quiz.setAccount(account);
        quiz.setTitle(title);
        quiz.setSubject(subject);
        return quizRepository.save(quiz);
    }

    public Optional<Quiz> getQuizzesById(Long id) {
        return quizRepository.findById(id);
    }

    public List<QuizDTO> getQuizzesByAccountId(String accountId) {
        return quizRepository.findByAccountId(accountId).stream()
                .map(quiz -> new QuizDTO(
                        quiz.getId(),
                        quiz.getTitle(),
                        quiz.getSubject(), // Include subject
                        quiz.getQuestions().stream()
                                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getQuestionType()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public List<QuizDTO> getQuizzesByClassCode(String classCode) {
        return quizRepository.findByClassCode(classCode).stream()
                .map(quiz -> new QuizDTO(
                        quiz.getId(),
                        quiz.getTitle(),
                        quiz.getSubject(), // Include subject
                        quiz.getQuestions().stream()
                                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getQuestionType()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public List<QuizDTO> getQuizzesByAccountIdAndClassCode(String accountId, String classCode) {
        List<Quiz> quizzes;
        if (classCode == null || classCode.isEmpty()) {
            quizzes = quizRepository.findByAccountIdAndClassCodeIsNull(accountId);
        } else {
            quizzes = quizRepository.findByAccountIdAndClassCode(accountId, classCode);
        }

        return quizzes.stream()
                .map(quiz -> new QuizDTO(
                        quiz.getId(),
                        quiz.getTitle(),
                        quiz.getSubject(),
                        quiz.getQuestions().stream()
                                .map(q -> new QuestionDTO(q.getId(), q.getQuestionText(), q.getQuestionType()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    public List<QuizDTO> findQuizzesByAccountIdAndClassCode(String accountId, String classCode) {
        return quizRepository.findQuizzesByAccountIdAndClassCode(accountId, classCode);
    }

    @Transactional
    public Quiz updateQuizClassCode(Long quizId, String classCode) {
        Quiz quiz = quizRepository.findById(String.valueOf(quizId))
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        quiz.setClassCode(classCode);
        return quizRepository.save(quiz);
    }
}
