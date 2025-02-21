package com.edu.aiedu.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quizzes")
public class Quiz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String subject;

    @Column(nullable = true)
    private String classCode;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @JsonManagedReference
    public void setQuestions(List<Question> questions) {
        this.questions = questions;
        for (Question question : questions) {
            question.setQuiz(this); // Ensure proper bidirectional mapping
        }
    }
}
