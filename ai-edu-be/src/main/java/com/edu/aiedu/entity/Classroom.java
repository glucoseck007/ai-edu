package com.edu.aiedu.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Classroom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String section;
    String subject;
    String room;
    String classroomCode;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @JsonBackReference
    private Account account;

    @OneToMany(mappedBy = "classroom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<ClassroomContent> contents;

}
