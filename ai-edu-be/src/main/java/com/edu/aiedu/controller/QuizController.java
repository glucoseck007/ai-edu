package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.QuizDTO;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveQuiz(@RequestBody QuizDTO quizDTO) {
        Quiz savedQuiz = quizService.saveQuiz(quizDTO);
        return ResponseEntity.ok(savedQuiz);
    }
}

