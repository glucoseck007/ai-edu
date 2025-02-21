package com.edu.aiedu.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentAddClassDTO {
    private String student_code;
    private String class_name;
    private String school_code;
}
