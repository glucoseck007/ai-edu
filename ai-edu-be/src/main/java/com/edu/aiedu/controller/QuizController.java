package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.QuizDTO;
import com.edu.aiedu.dto.ai.QuizResponseDTO;
import com.edu.aiedu.dto.request.AssignQuizRequest;
import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.service.QuizService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
        String accountId = (String) payload.get("userId");
        String title = (String) payload.get("title");
        String subject = (String) payload.get("subject");
         if (quizObj == null) {
             return ResponseEntity.badRequest().build();
         }
         Quiz quiz = convertToQuiz(quizObj);
        Quiz savedQuiz = quizService.saveQuiz(quiz, accountId, subject, title);
        return ResponseEntity.ok(savedQuiz);
    }

//    @GetMapping("/{quizId}")
//    public ResponseEntity<List<QuizDTO>> getQuizzesById(@PathVariable Long quizId) {
//        List<QuizDTO> quizzes = quizService.getQuizzesById(quizId);
//        return ResponseEntity.ok(quizzes);
//    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<QuizDTO>> getQuizzesByAccount(@PathVariable String accountId) {
        List<QuizDTO> quizzes = quizService.getQuizzesByAccountId(accountId);
        return ResponseEntity.ok(quizzes);
    }

    private Quiz convertToQuiz(Object quizObj) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.valueToTree(quizObj);

            Quiz quiz = new Quiz();

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
    @GetMapping("/by-class")
    public ResponseEntity<List<QuizDTO>> getQuizzesByClassCode(@RequestParam String classCode) {
        List<QuizDTO> quizzes = quizService.getQuizzesByClassCode(classCode);
        return ResponseEntity.ok(quizzes);
    }


    @GetMapping("/by-account-class")
    public ResponseEntity<List<QuizDTO>> getQuizzesByAccountAndClass(
            @RequestParam String accountId,
            @RequestParam String classCode) {
        List<QuizDTO> quizzes = quizService.getQuizzesByAccountIdAndClassCode(accountId, classCode);
        return ResponseEntity.ok(quizzes);
    }

//    @GetMapping("/get/{quizId}")
//    public ResponseEntity<Map<String, Object>> getQuizById(@PathVariable Long quizId) {
//        Optional<Quiz> quizOptional = quizService.getQuizzesById(quizId);
//
//        if (quizOptional.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Quiz quiz = quizOptional.get();
//
//        List<Map<String, Object>> quizData = new ArrayList<>();
//        for (Question question : quiz.getQuestions()) {
//            Map<String, Object> questionMap = new HashMap<>();
//            questionMap.put("Question", question.getQuestionText());
//            questionMap.put("Answers", question.getAnswers());
//            questionMap.put("Correct Answer", question.getCorrectAnswer());
//            questionMap.put("Reference", question.getReference());
//            questionMap.put("Question Type", question.getQuestionType());
//
//            quizData.add(questionMap);
//        }
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("quiz", quizData);
//        response.put("userId", quiz.getAccount().getId());
//        response.put("title", quiz.getTitle());
//        response.put("subject", quiz.getSubject());
//
//        return ResponseEntity.ok(response);
//    }
@GetMapping("/get/{quizId}")
public ResponseEntity<Map<String, Object>> getQuizById(@PathVariable Long quizId) {
    Optional<Quiz> quizOptional = quizService.getQuizzesById(quizId);

    if (quizOptional.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Quiz quiz = quizOptional.get();

    List<Map<String, Object>> quizData = new ArrayList<>();
    for (Question question : quiz.getQuestions()) {
        Map<String, Object> questionMap = new HashMap<>();
        questionMap.put("Question", question.getQuestionText());
        questionMap.put("Answers", question.getAnswers());
        questionMap.put("Correct Answer", question.getCorrectAnswer());
        questionMap.put("Reference", question.getReference());
        questionMap.put("Question Type", question.getQuestionType());

        quizData.add(questionMap);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("quiz", quizData); // Only return quiz questions

    return ResponseEntity.ok(response);
}



    @PostMapping("/assign-quiz")
    public ResponseEntity<Quiz> assignQuiz(@RequestBody AssignQuizRequest request) {
        Quiz updatedQuiz = quizService.updateQuizClassCode(request.getQuizId(), request.getClassCode());
        return ResponseEntity.ok(updatedQuiz);
    }

    @GetMapping("/by-account-classCode")
    public ResponseEntity<List<QuizDTO>> getQuizzesByAccountAndClassCode(@RequestParam String accountId,
                                                                         @RequestParam String classCode) {
        List<QuizDTO> quizDTOS = quizService.findQuizzesByAccountIdAndClassCode(accountId, classCode);
        return ResponseEntity.ok(quizDTOS);
    }
}
