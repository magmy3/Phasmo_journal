package com.phasmo.journal.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "ghost_specific")
public class GhostSpecific {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ghost_id")
    @JsonIgnore // Zabrání zacyklení dat
    private Ghost ghost;

    private String situation;
    private String speed;
    
    @Column(name = "hunt_threshold")
    private String huntThreshold;
    
    @Column(name = "notes_on_behaviour", columnDefinition = "TEXT")
    private String notesOnBehaviour;

    public GhostSpecific() {}

    // GETTERY A SETTERY
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Ghost getGhost() { return ghost; }
    public void setGhost(Ghost ghost) { this.ghost = ghost; }
    public String getSituation() { return situation; }
    public void setSituation(String situation) { this.situation = situation; }
    public String getSpeed() { return speed; }
    public void setSpeed(String speed) { this.speed = speed; }
    public String getHuntThreshold() { return huntThreshold; }
    public void setHuntThreshold(String huntThreshold) { this.huntThreshold = huntThreshold; }
    public String getNotesOnBehaviour() { return notesOnBehaviour; }
    public void setNotesOnBehaviour(String notesOnBehaviour) { this.notesOnBehaviour = notesOnBehaviour; }
}
