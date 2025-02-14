package com.edu.aiedu.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
public class ClassroomDTO {
    private String id;
    private String schoolCode;
    private String name;
    private String section;
    private String subject;
    private String room;
    private String accountId;
    private String classroomCode;

    public ClassroomDTO(String name, String schoolCode) {
        this.name = name;
        this.schoolCode = schoolCode;
    }

    public ClassroomDTO(String id, String name, String section, String subject, String room, String accountId, String classroomCode) {
        this.id = id;
        this.name = name;
        this.section = section;
        this.subject = subject;
        this.room = room;
        this.accountId = accountId;
        this.classroomCode = classroomCode;
    }

    public ClassroomDTO(String id, String name, String section, String subject, String room, String accountId, String classroomCode, String schoolCode) {
        this.id = id;
        this.name = name;
        this.section = section;
        this.subject = subject;
        this.room = room;
        this.accountId = accountId;
        this.classroomCode = classroomCode;
        this.schoolCode = schoolCode;
    }

}
