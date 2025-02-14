package com.edu.aiedu.service;

import com.edu.aiedu.dto.request.QuizDTO;
import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.QuizRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    public QuizService(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Transactional
    public Quiz saveQuiz(QuizDTO quizDTO) {
        List<Question> questions = quizDTO.getQuiz().stream().map(q ->
                new Question(q.getQuestionType(), q.getQuestion(), q.getAnswers(), q.getCorrectAnswer(), q.getReference())
        ).collect(Collectors.toList());

        Quiz quiz = new Quiz(questions);
        return quizRepository.save(quiz);
    }
}

