package com.phasmo.journal.controller;

import com.phasmo.journal.model.Ghost;
import com.phasmo.journal.repository.GhostRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ghosts")
@CrossOrigin(origins = "*")
public class GhostController {

    private final GhostRepository ghostRepository;

    public GhostController(GhostRepository ghostRepository) {
        this.ghostRepository = ghostRepository;
    }

    @GetMapping
    public List<Ghost> getAllGhosts() {
        return ghostRepository.findAll();
    }
}
