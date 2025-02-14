package com.edu.aiedu.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionType;
    private String question;

    @ElementCollection
    private List<String> answers;

    private String correctAnswer;
    private String reference;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    // Constructors
    public Question() {}

    public Question(String questionType, String question, List<String> answers, String correctAnswer, String reference) {
        this.questionType = questionType;
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.reference = reference;
    }

    // Getters and Setters
    public Long getId() { return id; }
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

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
}

