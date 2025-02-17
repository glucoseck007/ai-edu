package com.edu.aiedu.dto.ai;

public class AccountClassroomQuizDTO {
    private String accountId;
    private String classroomCode;
    private String quizId;

    public AccountClassroomQuizDTO(String accountId, String classroomCode, String quizId) {
        this.accountId = accountId;
        this.classroomCode = classroomCode;
        this.quizId = quizId;
    }

    // Getters and setters
    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getClassroomCode() {
        return classroomCode;
    }

    public void setClassroomCode(String classroomCode) {
        this.classroomCode = classroomCode;
    }

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }
}

