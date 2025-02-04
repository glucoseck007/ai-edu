package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.AskQuestionRequest;
import com.edu.aiedu.dto.response.AskQuestionResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/ask-question")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    @PostMapping
    public AskQuestionResponse askQuestion(@RequestBody AskQuestionRequest request) {
        log.info("Received question from student: {}", request.getStudentCode());

        AskQuestionResponse response = new AskQuestionResponse();
        response.setMessage("Question submitted successfully");
        response.setSuccess(true);

        return response;
    }
}
