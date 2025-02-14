package com.edu.aiedu.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    // Constructors
    public Quiz() {}

    public Quiz(List<Question> questions) {
        this.questions = questions;
        this.questions.forEach(q -> q.setQuiz(this));
    }

    // Getters and Setters
    public Long getId() { return id; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
        this.questions.forEach(q -> q.setQuiz(this));
    }
}

