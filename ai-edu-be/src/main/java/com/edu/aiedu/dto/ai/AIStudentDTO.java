package com.edu.aiedu.dto.ai;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIStudentDTO {

    String student_name;
    String student_code;
    String student_gender;
    String school_code;
    String class_level;
    String class_name;
}
