package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.ClassCodesRequest;
import com.edu.aiedu.dto.ai.QuizAttempt;
import com.edu.aiedu.dto.ai.QuizDTO;
import com.edu.aiedu.dto.request.AssignQuizRequest;
import com.edu.aiedu.dto.request.ListQuizRequest;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Question;
import com.edu.aiedu.entity.Quiz;
import com.edu.aiedu.repository.QuizAttemptRepository;
import com.edu.aiedu.service.AccountService;
import com.edu.aiedu.service.QuizService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    private final QuizService quizService;
    private final AccountService accountService;
    private final QuizAttemptRepository quizAttemptRepository;

    public QuizController(QuizService quizService, AccountService accountService, QuizAttemptRepository quizAttemptRepository) {
        this.quizService = quizService;
        this.accountService = accountService;
        this.quizAttemptRepository = quizAttemptRepository;
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

    @PostMapping("/student/list-quiz")
    public ResponseEntity<?> getQuizzesByClassCodes(@RequestBody ListQuizRequest listQuizRequest) {
        List<QuizDTO> quizzes = quizService.getListQuizzesByClassCode(listQuizRequest.getClassCodes(), listQuizRequest.getAccountId());
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

    @PostMapping("/evaluate/{quizId}")
    public ResponseEntity<Map<String, Object>> evaluateQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Integer, String> userAnswers) {

        Optional<Quiz> quizOptional = quizService.getQuizzesById(quizId);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Quiz quiz = quizOptional.get();
        List<Question> questions = quiz.getQuestions();

        int score = 0;
        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            String correctAnswer = question.getCorrectAnswer();
            String userAnswer = userAnswers.get(i);

            boolean isCorrect = userAnswer != null && userAnswer.equals(correctAnswer);

            Map<String, Object> questionResult = new HashMap<>();
            questionResult.put("Question", question.getQuestionText());
            questionResult.put("Your Answer", userAnswer);
            questionResult.put("Correct Answer", correctAnswer);
            questionResult.put("Is Correct", isCorrect);

            if (isCorrect) {
                score++;
            }

            results.add(questionResult);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("totalQuestions", questions.size());
        response.put("results", results);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/evaluate/{quizId}/{accountId}")
    public ResponseEntity<Map<String, Object>> evaluateQuiz(
            @PathVariable Long quizId,
            @PathVariable String accountId, // Account ID as a String (UUID)
            @RequestBody Map<Integer, String> userAnswers) {

        Optional<Quiz> quizOptional = quizService.getQuizzesById(quizId);
        if (quizOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Account> accountOptional = accountService.getAccountById(accountId);
        if (accountOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Account not found"));
        }

        Quiz quiz = quizOptional.get();
        Account account = accountOptional.get();
        List<Question> questions = quiz.getQuestions();

        int score = 0;
        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            String correctAnswer = question.getCorrectAnswer();
            String userAnswer = userAnswers.get(i);

            boolean isCorrect = userAnswer != null && userAnswer.equals(correctAnswer);

            Map<String, Object> questionResult = new HashMap<>();
            questionResult.put("Question", question.getQuestionText());
            questionResult.put("Your Answer", userAnswer);
            questionResult.put("Correct Answer", correctAnswer);
            questionResult.put("Is Correct", isCorrect);
            questionResult.put("References", question.getReference());

            if (isCorrect) {
                score++;
            }

            results.add(questionResult);
        }

        // Save quiz attempt history
        QuizAttempt quizAttempt = QuizAttempt.builder()
                .account(account)
                .quiz(quiz)
                .selectedAnswers(userAnswers)
                .score(score)
                .totalQuestions(questions.size())
                .createdDate(LocalDateTime.now())
                .build();

        quizAttemptRepository.save(quizAttempt);

        Map<String, Object> response = new HashMap<>();
        response.put("score", score);
        response.put("totalQuestions", questions.size());
        response.put("results", results);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/attempt/{quizId}/{accountId}")
    public ResponseEntity<?> getQuizAttempts(
            @PathVariable Long quizId,
            @PathVariable String accountId) {

        List<QuizAttempt> quizAttempts = quizAttemptRepository.findByQuizIdAndAccountId(quizId, accountId);

        if (quizAttempts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No attempts found for this quiz and user"));
        }

        List<Map<String, Object>> responseList = new ArrayList<>();

        for (QuizAttempt quizAttempt : quizAttempts) {
            Quiz quiz = quizAttempt.getQuiz();
            List<Question> questions = quiz.getQuestions();
            Map<Integer, String> selectedAnswers = quizAttempt.getSelectedAnswers();

            Map<String, Object> attemptData = new HashMap<>();
            attemptData.put("attemptId", quizAttempt.getId()); // Include attempt ID
            attemptData.put("quizId", quiz.getId());
            attemptData.put("accountId", quizAttempt.getAccount().getId());
            attemptData.put("score", (quizAttempt.getScore()/quizAttempt.getTotalQuestions()));
            attemptData.put("totalQuestions", quizAttempt.getTotalQuestions());
            attemptData.put("selectedAnswers", selectedAnswers);

            // List to store detailed question results
            List<Map<String, Object>> results = new ArrayList<>();

            for (int i = 0; i < questions.size(); i++) {
                Question question = questions.get(i);
                String correctAnswer = question.getCorrectAnswer();
                String userAnswer = selectedAnswers.get(i);

                boolean isCorrect = userAnswer != null && userAnswer.equals(correctAnswer);

                Map<String, Object> questionResult = new HashMap<>();
                questionResult.put("question", question.getQuestionText());
                questionResult.put("userAnswer", userAnswer);
                questionResult.put("correctAnswer", correctAnswer);
                questionResult.put("isCorrect", isCorrect);
                questionResult.put("reference", question.getReference());

                results.add(questionResult);
            }

            attemptData.put("results", results);
            responseList.add(attemptData);
        }

        return ResponseEntity.ok(responseList);
    }


    @GetMapping("/attempts/{accountId}")
    public ResponseEntity<?> getQuizAttemptsByAccountId(@PathVariable String accountId) {
        List<QuizAttempt> quizAttempts = quizAttemptRepository.findByAccountId(accountId);

        if (quizAttempts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No quiz attempts found for this user"));
        }

        // Preparing response list
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (QuizAttempt attempt : quizAttempts) {
            Quiz quiz = attempt.getQuiz();
            List<Question> questions = quiz.getQuestions();
            Map<Integer, String> selectedAnswers = attempt.getSelectedAnswers();

            // Building attempt data
            Map<String, Object> attemptData = new HashMap<>();

            attemptData.put("subject", quiz.getSubject());
            attemptData.put("testName", quiz.getTitle());
            attemptData.put("score", attempt.getScore() * 10);
            attemptData.put("date", attempt.getCreatedDate());

            // List to store question results
            responseList.add(attemptData);
        }

        return ResponseEntity.ok(responseList);
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
