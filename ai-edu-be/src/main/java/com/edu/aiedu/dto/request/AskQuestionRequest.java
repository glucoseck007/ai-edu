package com.edu.aiedu.dto.request;

import lombok.Data;

@Data
public class AskQuestionRequest {
    private String studentCode;
    private String question;
    private String subject;
}
