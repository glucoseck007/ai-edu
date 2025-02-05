package com.edu.aiedu.entity;

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

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Lob
    @Column(name = "file_data")
    private byte[] fileData;

    @Column(name = "file_name")
    private String fileName;
}
