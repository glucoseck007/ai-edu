package com.edu.aiedu.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error"),
    ACCOUNT_EXISTED(1002, "Account already existed"),
    USERNAME_INVALID(1003, "Username must contain at least 3 characters"),
    PASSWORD_INVALID(1004, "Password must contain at least 8 characters"),
    USER_NOT_EXISTED(1005, "User not existed"),
    UNAUTHENTICATED(1006, "Unauthenticated"),
    PASSWORD_EXISTED(1007, "Password already existed"),
    EMAIL_HAS_BEEN_USED(1008, "Email has been used"),
    PASSWORD_INCORRECT(1009, "Password incorrect"),
    ROLE_NOT_VALID(1010, "Role not valid"),

    // New error codes for verification
    ACCOUNT_ALREADY_VERIFIED(1011, "Account already verified"),
    INVALID_VERIFICATION_CODE(1012, "Invalid or expired verification code"),
    EMAIL_SENDING_FAILED(1013, "Failed to send verification email");

    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
