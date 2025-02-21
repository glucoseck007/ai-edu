package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.dto.ai.QuizAttemptDTO;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.repository.QuizAttemptRepository;
import com.edu.aiedu.service.QuizAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-attempt")
public class QuizAttemptController {

    QuizAttemptService quizAttemptService;

    public QuizAttemptController(QuizAttemptService quizAttemptService) {
        this.quizAttemptService = quizAttemptService;
    }

    @GetMapping("/account/{quizId}")
    public boolean checkQuizAttempt(@PathVariable Long quizId, @RequestParam String accountId) {
        List<QuizAttemptDTO> quizAttempt = quizAttemptService.findAllByQuizId(quizId);
        for (QuizAttemptDTO quizAttemptDTO : quizAttempt) {
            if (quizAttemptDTO.getAccountId().equals(accountId)) {
                return true;
            }
        }
        return false;
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<List<QuizAttemptDTO>> getQuizAttempt(@PathVariable("quizId") Long quizId) {
        List<QuizAttemptDTO> a = quizAttemptService.findAllByQuizId(quizId);
        return ResponseEntity.ok(a);
    }
}
