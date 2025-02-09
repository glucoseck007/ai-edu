package com.edu.aiedu.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassroomContentUploadRequest {
    private String classroomId;
    private String title;
    private String content;
    private byte[] fileData;   // Base64-decoded file data
    private String fileName;   // Name of the file
    private String fileType;   // MIME type (e.g., application/pdf)
}
