package com.kickr_server.competitions;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    public List<Competition> findAll() {
        return competitionRepository.findAll();
    }

    public Competition getCompetitionById(UUID id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competition introuvable"));
    }
}
