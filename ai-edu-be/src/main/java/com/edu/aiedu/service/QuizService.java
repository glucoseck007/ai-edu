package com.edu.aiedu.service;

import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.QuizRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

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
}
