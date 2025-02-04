package com.edu.aiedu.dto.request.account;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordCreationRequest {
    @Size(min = 8, message = "PASSWORD_INVALID")
    String password;
}
