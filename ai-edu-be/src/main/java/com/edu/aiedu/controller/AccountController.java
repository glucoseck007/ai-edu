package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.AIStudentDTO;
import com.edu.aiedu.dto.ai.AITeacherDTO;
import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.dto.request.account.*;
import com.edu.aiedu.dto.response.AccountResponse;
import com.edu.aiedu.dto.response.ApiResponse;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.service.AccountService;
import com.edu.aiedu.service.ExternalApiService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountController {
    AccountService accountService;
    private final ExternalApiService externalApiService;
    private final Logger logger = LoggerFactory.getLogger(AccountController.class);

    @GetMapping("/list")
    public ResponseEntity<Page<AccountResponse>> getAllAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(accountService.getAllAccounts(page, size));
    }

    @PostMapping("/create-account")
    ApiResponse<AccountResponse> createAccount(@RequestBody @Valid AccountCreationRequest request) {
        AccountResponse accountResponse = accountService.createAccount(request);

        if (accountResponse != null) {
            try {
                if (accountResponse.getRoles().contains("teacher")) {
                    String teacher_name = accountResponse.getFirstName() + " " + accountResponse.getLastName();
                    String teacher_code = accountResponse.getId().substring(0, 5);
                    String teacher_gender = Math.random() < 0.5 ? "male" : "female";
                    String school_code = request.getSchool_code();
                    AITeacherDTO teacher = new AITeacherDTO(teacher_name, teacher_code, teacher_gender, school_code);
                    externalApiService.callExternalAddTeacher(teacher);
                } else {
                    String student_name = accountResponse.getFirstName() + " " + accountResponse.getLastName();
                    String student_code = accountResponse.getId().substring(0, 5);
                    String student_gender = Math.random() < 0.5 ? "male" : "female";
                    String school_code = request.getSchool_code();
                    String class_level = request.getClass_level();
//                    String class_name = request.getClass_name();
                    externalApiService.callExternalAddStudent(new AIStudentDTO(student_name, student_code, student_gender, school_code, class_level));
                }
            } catch (Exception e) {
                logger.error("Failed to call external API: " + e.getMessage());
            }
        }

        return ApiResponse.<AccountResponse>builder()
                .result(accountResponse)
                .build();
    }

    @PostMapping("/resend-verification")
    public ApiResponse<String> resendVerificationCode(@RequestBody ResendVerificationRequest request) {
        try {
            boolean success = accountService.resendVerificationCode(request.getEmail());
            if (success) {
                return ApiResponse.<String>builder()
                        .result("Verification code sent successfully.")
                        .build();
            } else {
                return ApiResponse.<String>builder()
                        .result("Failed to resend verification code. Please check the email and try again.")
                        .build();
            }
        } catch (Exception e) {
            logger.error("Error while resending verification code: " + e.getMessage());
            return ApiResponse.<String>builder()
                    .result("An unexpected error occurred.")
                    .build();
        }
    }


    @PostMapping("/verify-account")
    ApiResponse<Void> verifyAccount(@RequestBody @Valid AccountVerificationRequest request) {
        accountService.verifyAccount(request);
        return ApiResponse.<Void>builder()
                .message("Account verified successfully. You can now log in.")
                .build();
    }

    @PostMapping("/create-password")
    ApiResponse<Void> createPassword(@RequestBody @Valid PasswordCreationRequest request) {
        accountService.createPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password has been created, you could use it to login")
                .build();
    }

    @PostMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody @Valid PasswordChangeRequest request) {
        accountService.changePassword(request);
        return ApiResponse.<Void>builder()
                .message("Password has been changed")
                .build();
    }


    @GetMapping
    ApiResponse<List<AccountResponse>> getAccounts(@RequestParam(value = "page", defaultValue = "0") int page,
                                                   @RequestParam(value = "size", defaultValue = "10") int size) {

        var authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Username: {}", authentication.getName());
        authentication.getAuthorities().forEach(g -> log.info(g.getAuthority()));

        return ApiResponse.<List<AccountResponse>>builder()
                .result(accountService.getUsers(page, size))
                .build();
    }

    @GetMapping("/{accountId}")
    ApiResponse<AccountResponse> getAccount(@PathVariable("accountId") String userId) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.getUser(userId))
                .build();
    }

    @GetMapping("/my-info")
    ApiResponse<AccountResponse> getMyInfo() {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.getMyInfo())
                .build();
    }

    @PutMapping("/{accountId}")
    ApiResponse<AccountResponse> updateAccount(@PathVariable("accountId") String userId, @RequestBody AccountUpdateRequest user) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.updateUser(userId, user))
                .build();
    }

    @DeleteMapping("/{accountId}")
    ApiResponse<String> deleteAccount(@PathVariable("accountId") String userId) {
        accountService.deleteUser(userId);
        return ApiResponse.<String>builder()
                .result("Account deleted")
                .build();
    }

    @DeleteMapping("/{accountId}/{school_code}")
    ApiResponse<String> deleteTeacher(@PathVariable("accountId") String userId, @PathVariable("school_code") String schoolCode, @RequestBody String role) {
        accountService.deleteById(userId);
        if (role.equals("teacher")) {
            externalApiService.callExternalDeleteTeacher(schoolCode, userId.substring(0, 5));
        } else {
            externalApiService.callExternalDeleteStudent(schoolCode, userId.substring(0, 5));
        }
        return ApiResponse.<String>builder()
                .result("Account deleted")
                .build();
    }

    @GetMapping("/{accountId}/classes")
    public ResponseEntity<List<ClassroomDTO>> getClassesForAccount(@PathVariable String accountId) {
        List<ClassroomDTO> classrooms = accountService.getClassesForAccount(accountId);
        return ResponseEntity.ok(classrooms);
    }
}
