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
    public ResponseEntity<Classroom> addClass(@RequestBody ClassroomDTO classroomDTO) {
        Classroom savedClassroom = classroomService.addClass(classroomDTO);
        return ResponseEntity.ok(savedClassroom);
    }

    @GetMapping("/list_classes")
    public ResponseEntity<List<Classroom>> getAllClasses() {
        List<Classroom> classrooms = classroomService.getAllClasses();
        return ResponseEntity.ok(classrooms);
    }
}
