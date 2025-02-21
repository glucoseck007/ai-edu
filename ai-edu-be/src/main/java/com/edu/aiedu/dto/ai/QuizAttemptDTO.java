package com.edu.aiedu.dto.ai;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class QuizAttemptDTO {
    private Long id;
    private String fullName;
    private int score;
    private boolean status;
    private String accountId;
}
