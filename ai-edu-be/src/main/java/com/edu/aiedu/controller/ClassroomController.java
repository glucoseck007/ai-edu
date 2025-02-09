package com.edu.aiedu.controller;

import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classroom")
public class ClassroomController {
    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping("/add_class")
    public ResponseEntity<ClassroomDTO> addClass(@RequestBody ClassroomDTO classroomDTO) {
        Classroom savedClassroom = classroomService.addClass(classroomDTO);
        ClassroomDTO responseDTO = new ClassroomDTO(
                savedClassroom.getId(),
                savedClassroom.getName(),
                savedClassroom.getSection(),
                savedClassroom.getSubject(),
                savedClassroom.getRoom(),
                savedClassroom.getAccount().getId(), // Only return the Account ID
                savedClassroom.getClassroomCode()
        );
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/list_classes")
    public ResponseEntity<List<ClassroomDTO>> getClassesByAccountId(@RequestParam String accountId) {
        List<ClassroomDTO> classrooms = classroomService.getClassesByAccountId(accountId);
        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/classroom-detail")
    public ResponseEntity<ClassroomDTO> getClassDetail(@RequestParam String id) {
        ClassroomDTO classroomDTO = classroomService.getClassById(id);
        return ResponseEntity.ok(classroomDTO);
    }
//    @GetMapping("/list_classes")
//    public ResponseEntity<List<ClassroomDTO>> getAllClasses() {
//        List<ClassroomDTO> classrooms = classroomService.getAllClasses();
//        return ResponseEntity.ok(classrooms);
//    }
}
