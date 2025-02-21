package com.edu.aiedu.dto.ai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class QuizDTO {
    private Long id;
    private String title;
    private String subject;
    private List<QuestionDTO> questions;
    private String classCode;
    private boolean isCompleted;

    public QuizDTO(Long id, String title, String classCode) {
        this.id = id;
        this.title = title;
        this.classCode = classCode;
    }

    public QuizDTO(Long id, String title, String subject, List<QuestionDTO> questions) {
        this.id = id;
        this.title = title;
        this.questions = questions;
        this.subject = subject;
    }

    public QuizDTO(Long id, String title, String subject, List<QuestionDTO> questions, boolean isCompleted) {
        this.id = id;
        this.title = title;
        this.questions = questions;
        this.subject = subject;
        this.isCompleted = isCompleted;
    }
}

