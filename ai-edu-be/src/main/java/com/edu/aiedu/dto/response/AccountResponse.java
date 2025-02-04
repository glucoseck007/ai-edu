package com.edu.aiedu.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String address;
    String email;
    boolean noPassword;
    Set<String> roles;
}
