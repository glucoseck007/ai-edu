package com.edu.aiedu.dto.response;

import com.edu.aiedu.dto.request.account.UserInfoDTO;
import com.edu.aiedu.entity.Account;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    UserInfoDTO user;
    String token;
    boolean authenticated;
}
