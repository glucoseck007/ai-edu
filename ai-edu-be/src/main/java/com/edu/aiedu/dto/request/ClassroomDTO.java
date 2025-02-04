package com.edu.aiedu.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassroomDTO {
    private String name;
    private String section;
    private String subject;
    private String room;
    private String accountId;
}
