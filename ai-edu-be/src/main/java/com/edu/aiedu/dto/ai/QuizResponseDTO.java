package com.edu.aiedu.dto.ai;

import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizResponseDTO {
    private Long id;
    private List<Question> questions;

    public QuizResponseDTO(Quiz quiz) {
        this.id = quiz.getId();
        this.questions = quiz.getQuestions();
    }
}
