package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.dto.ai.QuizAttemptDTO;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.QuizAttemptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {

    QuizAttemptRepository quizAttemptRepository;

    public QuizAttemptService(QuizAttemptRepository quizAttemptRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public List<QuizAttempt> findAll() {
        return quizAttemptRepository.findAll();
    }

    public List<QuizAttemptDTO> findAllByQuizId(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private QuizAttemptDTO convertToDTO(QuizAttempt quizAttempt) {
        return QuizAttemptDTO.builder()
                .id(quizAttempt.getId()) // Assuming QuizAttempt has an id
                .fullName(quizAttempt.getAccount().getFirstName() + " " + quizAttempt.getAccount().getLastName()) // Assuming Account has fullName
                .accountId(quizAttempt.getAccount().getId())
                .score(quizAttempt.getScore())
                .status(quizAttempt.getScore() >= 5) // Example: Pass if score >= 50
                .build();
    }

}
