package com.edu.aiedu.service;

import com.edu.aiedu.dto.ai.*;
import com.edu.aiedu.entity.Subject;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExternalApiService {

    private final RestTemplate restTemplate;

    public ExternalApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Async
    public void callExternalAddSubject(SubjectDTO subjectDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_subject"; // Replace with the actual IP and port

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SubjectDTO> requestEntity = new HttpEntity<>(subjectDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_subject API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalAddTeacher(AITeacherDTO teacherDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_teacher"; // Replace with the actual IP and port

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<AITeacherDTO> requestEntity = new HttpEntity<>(teacherDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_teacher API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalDeleteTeacher(String schoolCode, String teacherCode) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/remove_teacher/{school_code}/{teacher_code}";

            ResponseEntity<String> response = restTemplate.exchange(externalApiUrl, HttpMethod.DELETE, null, String.class, schoolCode, teacherCode);
            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Teacher deleted successfully from external API: " + teacherCode);
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalDeleteStudent(String schoolCode, String studentCode) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/remove_student/{school_code}/{student_code}";

            ResponseEntity<String> response = restTemplate.exchange(externalApiUrl, HttpMethod.DELETE, null, String.class, schoolCode, studentCode);
            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Student deleted successfully from external API: " + studentCode);
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalAddStudent(AIStudentDTO studentDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_student"; // Replace with the actual IP and port

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<AIStudentDTO> requestEntity = new HttpEntity<>(studentDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_student API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalAddClassAPI(AIClassroomDTO classroomDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_class"; // Replace with the actual IP and port

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<AIClassroomDTO> requestEntity = new HttpEntity<>(classroomDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_class API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalAddTeacherToClass(TeacherClassDTO teacherClassDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_teacher_class"; // Replace with the actual IP and port

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<TeacherClassDTO> requestEntity = new HttpEntity<>(teacherClassDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_teacher_class API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalAddSchoolAPI(SchoolDTO schoolDTO) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/add_school";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<SchoolDTO> requestEntity = new HttpEntity<>(schoolDTO, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(externalApiUrl, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Successfully called external /add_school API.");
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }

    @Async
    public void callExternalDeleteSchoolAPI(String schoolCode) {
        try {
            String externalApiUrl = "http://192.168.50.122:8000/remove_school/{school_code}";

            ResponseEntity<String> response = restTemplate.exchange(externalApiUrl, HttpMethod.DELETE, null, String.class, schoolCode);
            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("School deleted successfully from external API." + schoolCode);
            } else {
                System.err.println("Failed to call external API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Error while calling external API: " + e.getMessage());
        }
    }


}

