package com.edu.aiedu.controller;

import com.edu.aiedu.dto.ai.*;
import com.edu.aiedu.dto.request.ClassroomDTO;
import com.edu.aiedu.dto.request.JoinClassroomRequest;
import com.edu.aiedu.dto.response.ApiResponse;
import com.edu.aiedu.entity.Account;
import com.edu.aiedu.entity.Classroom;
import com.edu.aiedu.entity.School;
import com.edu.aiedu.repository.AccountRepository;
import com.edu.aiedu.repository.ClassroomRepository;
import com.edu.aiedu.repository.SchoolRepository;
import com.edu.aiedu.service.AccountClassroomService;
import com.edu.aiedu.service.AccountService;
import com.edu.aiedu.service.ClassroomService;
import com.edu.aiedu.service.ExternalApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/classroom")
public class ClassroomController {

    private static final Logger logger = LoggerFactory.getLogger(ClassroomController.class);

    private final AccountService accountService;
    private final ClassroomService classroomService;
    private final AccountClassroomService accountClassroomService;
    @Autowired
    private ExternalApiService externalApiService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private ClassroomRepository classroomRepository;

    public ClassroomController(ClassroomService classroomService, AccountService accountService, AccountClassroomService accountClassroomService) {
        this.classroomService = classroomService;
        this.accountService = accountService;
        this.accountClassroomService = accountClassroomService;
    }

    @GetMapping("/school_code")
    public String schoolCode(@RequestParam String classroomCode){
        return classroomService.getSchoolCodeByClassroomCode(classroomCode).getSchool().getSchoolCode();
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
                savedClassroom.getClassroomCode(),
                savedClassroom.getSchool().getSchoolCode(),
                savedClassroom.getCreatedDate()

        );

        AIClassroomDTO aiClassroomDTO = new AIClassroomDTO();
        aiClassroomDTO.setClass_name(savedClassroom.getClassroomCode());
        aiClassroomDTO.setClass_level(savedClassroom.getSection());
        aiClassroomDTO.setSchool_code(savedClassroom.getSchool().getSchoolCode());

        TeacherClassDTO teacherClassDTO = new TeacherClassDTO();
        teacherClassDTO.setClass_name(savedClassroom.getClassroomCode());
        teacherClassDTO.setTeacher_code(savedClassroom.getAccount().getId().substring(0, 5));
        teacherClassDTO.setSchool_code(savedClassroom.getSchool().getSchoolCode());

        externalApiService.callExternalAddClassAPI(aiClassroomDTO);
        externalApiService.callExternalAddTeacherToClass(teacherClassDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/remove_class/{class_name}/{school_code}")
    public ResponseEntity<ClassroomDTO> removeClass(@PathVariable String class_name, @PathVariable String school_code) {
        logger.info(school_code);
        try {
            classroomService.deleteClassroom(school_code, class_name);
            externalApiService.callExternalDeleteSchoolAPI(school_code);

            ClassroomDTO responseDTO = new ClassroomDTO(class_name, school_code);

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            logger.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/list_classes_owner")
    public ResponseEntity<List<ClassroomDTO>> getOwnClassesByAccountId(@RequestParam String accountId) {
        List<ClassroomDTO> classrooms = classroomService.getClassesByAccountId(accountId);
        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/list_classes_member")
    public ResponseEntity<List<ClassroomDTO>> getMemberClassesByAccountId(@RequestParam String accountId) {
        List<ClassroomDTO> classrooms = accountService.getClassesForAccount(accountId);
        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/profile/list-class-teacher")
    public ResponseEntity<List<TeacherProfileDTO>> getListTeacherClassForProfile(@RequestParam String accountId) {
        List<ClassroomDTO> classrooms = classroomService.getClassesByAccountId(accountId);
        List<TeacherProfileDTO> result = new ArrayList<>();
        for (ClassroomDTO classroomDTO : classrooms) {
//            Optional<Account> account = accountRepository.findById(classroomDTO.getAccountId());
            Optional<School> school = schoolRepository.findBySchoolCode(classroomDTO.getSchoolCode());
            String schoolName;
            if (school.isPresent()) {
                schoolName = school.get().getSchoolName();

            } else {
                schoolName = "";
            }
            int totalStudent = accountClassroomService.countStudent(classroomDTO.getId());
            TeacherProfileDTO profileClassDTO = new TeacherProfileDTO();
            profileClassDTO.setId(classroomDTO.getId());
            profileClassDTO.setClassCode(classroomDTO.getClassroomCode());
            profileClassDTO.setTitle(classroomDTO.getName());
            profileClassDTO.setGrade(classroomDTO.getSection());
            profileClassDTO.setStudentsCount(totalStudent);
            profileClassDTO.setTime(classroomDTO.getDate());
            profileClassDTO.setSchoolName(schoolName);
            result.add(profileClassDTO);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/profile/list-class")
    public ResponseEntity<List<ProfileClassDTO>> getListClassForProfile(@RequestParam String accountId) {
        List<ClassroomDTO> classrooms = accountService.getClassesForAccount(accountId);
        List<ProfileClassDTO> result = new ArrayList<>();
        for (ClassroomDTO classroomDTO : classrooms) {
            Optional<Account> account = accountRepository.findById(classroomDTO.getAccountId());
            ProfileClassDTO profileClassDTO = new ProfileClassDTO();
            profileClassDTO.setTeacher(account.get().getFirstName() + " " + account.get().getLastName());
            profileClassDTO.setTitle(classroomDTO.getName());
            profileClassDTO.setClassId(classroomDTO.getId());
            profileClassDTO.setClassCode(classroomDTO.getClassroomCode());
            result.add(profileClassDTO);
        }
        return ResponseEntity.ok(result);
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

    @PostMapping("/join")
    public ResponseEntity<String> joinClassroom(@RequestBody JoinClassroomRequest request) {
        try {
            Optional<Classroom> classroomOpt = classroomService.getClassroomByClassCode(request.getClassroomCode());
            Optional<Account> account = accountRepository.findById(request.getAccountId());
            StudentAddClassDTO studentDTO = new StudentAddClassDTO();
            studentDTO.setStudent_code(account.get().getId().substring(0, 5));
            studentDTO.setClass_name(classroomOpt.get().getClassroomCode());
            studentDTO.setSchool_code(classroomOpt.get().getSchool().getSchoolCode());
            classroomService.addAccountToClassroom(request.getAccountId(), request.getClassroomCode());
            externalApiService.callExternalJoinClass(studentDTO);

            return ResponseEntity.ok("Account added to classroom successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

//    @GetMapping("/list_classes")
//    public ResponseEntity<List<ClassroomDTO>> getClassroomsByAccountId(@RequestParam String accountId) {
//        List<ClassroomDTO> classrooms = classroomService.getClassroomsByAccountId(accountId);
//        return ResponseEntity.ok(classrooms);
//    }
    @GetMapping("/members/{classroomCode}")
    public ResponseEntity<List<ListClassMembersDTO>> getClassMembers(@PathVariable String classroomCode) {
        List<ListClassMembersDTO> members = accountClassroomService.getClassMembers(classroomCode);
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<List<Classroom>> getListClass(@PathVariable String accountId) {
        List<Classroom> a = accountClassroomService.getClassrooms(accountId);
        return ResponseEntity.ok(a);
    }

    @GetMapping("/classroomcode/{accountId}")
    public ResponseEntity<List<String>> getAllClassCode(@PathVariable String accountId) {
        List<Classroom> a = accountClassroomService.getClassrooms(accountId);
        List<String> result = new ArrayList<>();
        for (Classroom classroom : a) {
            result.add(classroom.getClassroomCode());
        }
        return ResponseEntity.ok(result);
    }
}
