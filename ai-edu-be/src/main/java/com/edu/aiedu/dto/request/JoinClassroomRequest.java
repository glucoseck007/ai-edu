package com.edu.aiedu.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinClassroomRequest {
    private String accountId;
    private String classroomCode;
}
