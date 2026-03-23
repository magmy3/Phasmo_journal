package com.phasmo.journal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ghost_general") // Zde Javě říkáme nové jméno tabulky
public class Ghost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "evidence_1")
    private String evidence1;

    @Column(name = "evidence_2")
    private String evidence2;

    @Column(name = "evidence_3")
    private String evidence3;

    @Column(columnDefinition = "TEXT")
    private String strength;

    @Column(columnDefinition = "TEXT")
    private String weakness;

    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "main_theme")
    private String mainTheme;

    // Prázdný konstruktor pro Spring
    public Ghost() {}

    // --- GETTERY A SETTERY ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEvidence1() { return evidence1; }
    public void setEvidence1(String evidence1) { this.evidence1 = evidence1; }

    public String getEvidence2() { return evidence2; }
    public void setEvidence2(String evidence2) { this.evidence2 = evidence2; }

    public String getEvidence3() { return evidence3; }
    public void setEvidence3(String evidence3) { this.evidence3 = evidence3; }

    public String getStrength() { return strength; }
    public void setStrength(String strength) { this.strength = strength; }

    public String getWeakness() { return weakness; }
    public void setWeakness(String weakness) { this.weakness = weakness; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getMainTheme() { return mainTheme; }
    public void setMainTheme(String mainTheme) { this.mainTheme = mainTheme; }
}
