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
    String class_code;

    public AIStudentDTO(String student_name, String student_code, String student_gender, String school_code, String class_level) {
        this.student_name = student_name;
        this.student_code = student_code;
        this.student_gender = student_gender;
        this.school_code = school_code;
        this.class_level = class_level;
    }
}
