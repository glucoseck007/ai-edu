package com.edu.aiedu.dto.request.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountVerificationRequest {
    private String email;

    @NotBlank
    private String verificationCode;
}

