package com.edu.aiedu.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class School {

    @Column(nullable = false, unique = true)
    private String schoolName;

    @Id
    @Column(nullable = false, unique = true)
    private String schoolCode;

    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Classroom> classrooms;

    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<Subject> subjects;

    public School(String schoolName, String schoolCode) {
        this.schoolName = schoolName;
        this.schoolCode = schoolCode;
    }
}
