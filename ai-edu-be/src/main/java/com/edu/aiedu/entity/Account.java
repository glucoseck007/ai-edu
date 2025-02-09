package com.edu.aiedu.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Account extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String username;
    String password;
    String firstName;
    String lastName;
    LocalDate dob;
    String phoneNumber;
    String address;
    String email;
    Set<String> roles;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Classroom> classrooms;
}
