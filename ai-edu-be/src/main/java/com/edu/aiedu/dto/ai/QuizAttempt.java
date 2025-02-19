package com.edu.aiedu.dto.ai;

import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Quiz;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    Account account; // Link to the Account entity

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    Quiz quiz;

    @ElementCollection
    @CollectionTable(name = "quiz_attempt_answers", joinColumns = @JoinColumn(name = "attempt_id"))
    @MapKeyColumn(name = "question_index")
    @Column(name = "user_answer")
    Map<Integer, String> selectedAnswers; // Stores user's selected answers

    int score;
    int totalQuestions;
}
