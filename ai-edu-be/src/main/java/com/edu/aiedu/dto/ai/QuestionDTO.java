package com.edu.aiedu.dto.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String questionType;

    public QuestionDTO(Long id, String questionText, String questionType) {
        this.id = id;
        this.questionText = questionText;
        this.questionType = questionType;
    }

    // Getters and Setters
}

