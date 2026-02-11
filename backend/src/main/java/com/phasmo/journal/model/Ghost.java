package com.phasmo.journal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ghosts")
@Data
public class Ghost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String strength;
    private String weakness;
}
