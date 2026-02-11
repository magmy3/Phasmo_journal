package com.phasmo.journal.repository;

import com.phasmo.journal.model.Ghost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GhostRepository extends JpaRepository<Ghost, Long> {
}
