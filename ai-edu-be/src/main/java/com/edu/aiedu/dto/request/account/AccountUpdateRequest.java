package com.edu.aiedu.dto.request.account;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountUpdateRequest {
    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String address;
    String email;
}
