package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.account.AccountCreationRequest;
import com.edu.aiedu.dto.request.account.AccountUpdateRequest;
import com.edu.aiedu.dto.request.account.PasswordChangeRequest;
import com.edu.aiedu.dto.request.account.PasswordCreationRequest;
import com.edu.aiedu.dto.response.AccountResponse;
import com.edu.aiedu.dto.response.ApiResponse;
import com.edu.aiedu.service.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping("/create-account")
    ApiResponse<AccountResponse> createAccount(@RequestBody @Valid AccountCreationRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .result(accountService.createAccount(request))
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
}
