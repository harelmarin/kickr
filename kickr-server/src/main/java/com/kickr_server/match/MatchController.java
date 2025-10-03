package com.kickr_server.match;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/next")
    public void getNextMatches() throws Exception {
        matchService.fetchAndSaveNextMatches();
    }
}
