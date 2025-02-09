package com.edu.aiedu.service;

import com.edu.aiedu.Utils.SecurityUtil;
import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.dto.request.account.AccountCreationRequest;
import com.edu.aiedu.dto.request.account.AccountUpdateRequest;
import com.edu.aiedu.dto.request.account.PasswordChangeRequest;
import com.edu.aiedu.dto.request.account.PasswordCreationRequest;
import com.edu.aiedu.dto.response.AccountResponse;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.enums.Role;
import com.edu.aiedu.exception.AppException;
import com.edu.aiedu.exception.ErrorCode;
import com.edu.aiedu.mapper.AccountMapper;
import com.edu.aiedu.repository.AccountClassroomRepository;
import com.edu.aiedu.repository.AccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AccountService {
    AccountRepository accountRepository;
    private final AccountClassroomRepository accountClassroomRepository;
    AccountMapper accountMapper;
    PasswordEncoder passwordEncoder;

    public AccountResponse createAccount(AccountCreationRequest request) {

        if (accountRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.ACCOUNT_EXISTED);

//        if (accountRepository.existsByEmail(request.getEmail()))
//            throw new AppException(ErrorCode.EMAIL_HAS_BEEN_USED);

        Account account = accountMapper.toUser(request);
        account.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<String> roles = new HashSet<>();
        if (isValidRole(request.getRole())) {
            roles.add(request.getRole());
            account.setRoles(roles);
        } else throw new AppException(ErrorCode.ROLE_NOT_VALID);

        account.setCreatedDate(LocalDateTime.now());
        account.setCreatedBy(SecurityUtil.getCurrentUsername());

        return accountMapper.toUserResponse(accountRepository.save(account));
    }

    private boolean isValidRole(String value) {
        try {
            Role role = Role.valueOf(value.toUpperCase());
            return !role.equals(Role.ADMIN);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public void createPassword(PasswordCreationRequest request) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = accountRepository.findByUsername(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (StringUtils.hasText(account.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_EXISTED);

        account.setPassword(passwordEncoder.encode(request.getPassword()));
        accountRepository.save(account);

    }

    public void changePassword(PasswordChangeRequest request) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = accountRepository.findByUsername(name).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var oldPassword = account.getPassword();

        if (!passwordEncoder.encode(request.getOldPassword()).equals(oldPassword))
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    public AccountResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        Account account = accountRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var accountResponse = accountMapper.toUserResponse(account);
        accountResponse.setNoPassword(StringUtils.hasText(account.getPassword()));

        return accountResponse;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<AccountResponse> getUsers(int page, int size) {

        Pageable pageable = PageRequest.of(page,size);

        return accountRepository.findAll(pageable).stream()
                .map(accountMapper::toUserResponse).toList();
    }

    public AccountResponse getUser(String userId) {
        return accountMapper.toUserResponse(accountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Account not found")));
    }

    @PostAuthorize("hasRole('ADMIN') || returnObject.username == authentication.name")
    public AccountResponse updateUser(String userId, AccountUpdateRequest request) {
        Account account = accountRepository.findById(userId).orElseThrow(() -> new RuntimeException("Account not found"));

        account.setLastModifiedDate(LocalDateTime.now());
        account.setLastModifiedBy(SecurityUtil.getCurrentUsername());

        accountMapper.updateUser(account,request);

        return accountMapper.toUserResponse(accountRepository.save(account));
    }

    public void deleteUser(String userId) {
        var account = accountRepository.findById(userId).orElseThrow(() -> new RuntimeException("Account not found"));
        account.setIsDeleted(true);
        account.setLastModifiedDate(LocalDateTime.now());
        account.setLastModifiedBy(SecurityUtil.getCurrentUsername());
    }

    public List<ClassroomDTO> getClassesForAccount(String accountId) {
        List<Classroom> classrooms = accountClassroomRepository.findClassroomsByAccountId(accountId);

        return classrooms.stream().map(
                classroom -> ClassroomDTO.builder()
                        .id(classroom.getId())
                        .name(classroom.getName())
                        .section(classroom.getSection())
                        .subject(classroom.getSubject())
                        .room(classroom.getRoom())
                        .accountId(classroom.getAccount().getId())
                        .classroomCode(classroom.getClassroomCode())
                        .build()).collect(Collectors.toList());
    }
}
