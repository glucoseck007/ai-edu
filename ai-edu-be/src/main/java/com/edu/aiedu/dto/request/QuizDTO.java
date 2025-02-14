package com.edu.aiedu.dto.request;

import java.util.List;

public class QuizDTO {

    private List<QuestionDTO> quiz;

    public List<QuestionDTO> getQuiz() {return quiz;}
    public void setQuiz(List<QuestionDTO> quiz) {
        this.quiz = quiz;
    }
}
