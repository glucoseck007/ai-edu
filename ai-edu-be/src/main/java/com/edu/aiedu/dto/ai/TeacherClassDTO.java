package com.edu.aiedu.dto.ai;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherClassDTO {
    private String teacher_code;
    private String class_name;
    private String school_code;
}
