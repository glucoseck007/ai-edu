package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.dto.ai.QuizAttemptDTO;
import com.edu.aiedu.repository.QuizAttemptRepository;
import com.edu.aiedu.service.QuizAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempt")
public class QuizAttemptController {

    QuizAttemptService quizAttemptService;

    public QuizAttemptController(QuizAttemptService quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<List<QuizAttemptDTO>> getQuizAttempt(@PathVariable("quizId") Long quizId) {
        List<QuizAttemptDTO> a = quizAttemptService.findAllByQuizId(quizId);
        return ResponseEntity.ok(a);
    }
}
