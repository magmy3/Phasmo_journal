package com.phasmo.journal;

import com.phasmo.journal.model.Ghost;
import com.phasmo.journal.model.GhostSpecific;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class GhostUnitTests {

    // Test 1: Kontrola základního vytváření entity ducha
    @Test
    public void testGhostCreationAndGetters() {
        Ghost ghost = new Ghost();
        ghost.setName("Banshee");
        ghost.setStrength("Targets one Player");

        assertEquals("Banshee", ghost.getName(), "Jméno ducha se musí shodovat");
        assertEquals("Targets one Player", ghost.getStrength(), "Síla ducha se musí shodovat");
    }

    // Test 2: Kontrola správného propojení základních a specifických dat (Relace)
    @Test
    public void testGhostSpecificLinking() {
        Ghost ghost = new Ghost();
        GhostSpecific specific = new GhostSpecific();
        specific.setSpeed("1.7 m/s");
        
        // Propojení oběma směry
        ghost.setSpecific(specific);
        specific.setGhost(ghost);

        assertNotNull(ghost.getSpecific(), "Specifická data nesmí být null");
        assertEquals("1.7 m/s", ghost.getSpecific().getSpeed(), "Rychlost ducha se musí shodovat");
        assertEquals(ghost, specific.getGhost(), "Specifická data musí odkazovat na správného ducha");
    }

    // Test 3: Kontrola logiky ukládání důkazů
    @Test
    public void testEvidenceAssignment() {
        Ghost ghost = new Ghost();
        ghost.setEvidence1("EMF 5");
        ghost.setEvidence2("Spirit Box");
        ghost.setEvidence3("D.O.T.S.");

        assertTrue(ghost.getEvidence1().contains("EMF"), "První důkaz by měl obsahovat EMF");
        assertFalse(ghost.getEvidence2().isEmpty(), "Druhý důkaz nesmí být prázdný");
        assertEquals("D.O.T.S.", ghost.getEvidence3(), "Třetí důkaz musí být přesně D.O.T.S.");
    }
}
