package com.edu.aiedu.dto.request;

import com.edu.aiedu.dto.ai.ClassCodesRequest;

import java.util.List;

public class ListQuizRequest {
    private List<String> classCodes;
    private String accountId;

    // Getters and Setters
    public List<String> getClassCodes() {
        return classCodes;
    }

    public void setClassCodes(List<String> classCodes) {
        this.classCodes = classCodes;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }
}



