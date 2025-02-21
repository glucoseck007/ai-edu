package com.edu.aiedu.dto.ai;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherProfileDTO {
    private String id;
    private String title;
    private LocalDateTime time;
    private String grade;
    private int studentsCount;
    private String schoolName;
    private String classCode;
}
