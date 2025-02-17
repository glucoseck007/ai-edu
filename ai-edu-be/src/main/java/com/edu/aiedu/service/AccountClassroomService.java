package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.AccountClassroomQuizDTO;
import com.edu.aiedu.repository.AccountClassroomRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountClassroomService {
    private final AccountClassroomRepository repository;

    public AccountClassroomService(AccountClassroomRepository repository) {
        this.repository = repository;
    }

//    public List<AccountClassroomQuizDTO> getAccountClassroomQuizzes() {
//        return repository.findAccountClassroomQuizzes();
//    }

    public List<AccountClassroomQuizDTO> getAccountClassroomQuizzesNative() {
        return repository.findAccountClassroomQuizzesNative().stream()
                .map(obj -> new AccountClassroomQuizDTO(
                        (String) obj[0],
                        (String) obj[1],
                        (String) obj[2]))
                .collect(Collectors.toList());
    }
}

