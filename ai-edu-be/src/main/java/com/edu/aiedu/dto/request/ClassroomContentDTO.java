package com.edu.aiedu.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClassroomContentDTO {
    private String id;
    private String title;
    private String content;
    private byte[] fileData;  // To hold the file bytes
    private String fileName;  // Optional: File name for download
    private String fileType;  // Optional: MIME type (e.g., "application/pdf")
    private String classroomId;
}
