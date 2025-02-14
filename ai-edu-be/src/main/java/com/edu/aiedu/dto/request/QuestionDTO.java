package com.edu.aiedu.dto.request;

import java.util.List;

public class QuestionDTO {
    private String questionType;
    private String question;
    private List<String> answers;
    private String correctAnswer;
    private String reference;

    // Getters and Setters
    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<String> getAnswers() { return answers; }
    public void setAnswers(List<String> answers) { this.answers = answers; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}

