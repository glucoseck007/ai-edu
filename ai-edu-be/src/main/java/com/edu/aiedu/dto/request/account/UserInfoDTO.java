package com.edu.aiedu.dto.request.account;

import lombok.*;

import java.util.Set;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {
    private String id;
    private String username;
    private Set<String> roles;
}

