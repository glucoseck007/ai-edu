package com.edu.aiedu.controller;

import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.service.QuizService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping(value = "/save", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Map<String, Object> payload) {
//        Quiz savedQuiz = quizService.saveQuiz(quiz);
//        return ResponseEntity.ok().body(savedQuiz);
        Object quizObj = payload.get("quiz");
         if (quizObj == null) {
             return ResponseEntity.badRequest().build();
         }
         Quiz quiz = convertToQuiz(quizObj);
        Quiz savedQuiz = quizService.saveQuiz(quiz);
        return ResponseEntity.ok(savedQuiz);
    }

    private Quiz convertToQuiz(Object quizObj) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.valueToTree(quizObj);

            Quiz quiz = new Quiz();
            quiz.setTitle("Default Title"); // Set a default title (or modify based on your data)

            List<Question> questionList = new ArrayList<>();
            if (rootNode.isArray()) { // Ensure it's an array
                for (JsonNode questionNode : rootNode) {
                    Question question = new Question();
                    question.setQuestionText(questionNode.get("Question").asText());
                    question.setCorrectAnswer(questionNode.get("Correct Answer").asText());
                    question.setReference(questionNode.get("Reference").asText());
                    question.setQuestionType(questionNode.get("Question Type").asText());

                    // Convert answers from JSON array to List<String>
                    List<String> answers = new ArrayList<>();
                    for (JsonNode answerNode : questionNode.get("Answers")) {
                        answers.add(answerNode.asText());
                    }
                    question.setAnswers(answers);

                    // Associate question with quiz
                    question.setQuiz(quiz);
                    questionList.add(question);
                }
            }

            quiz.setQuestions(questionList);
            return quiz;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
