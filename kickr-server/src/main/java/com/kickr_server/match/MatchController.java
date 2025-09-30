package com.kickr_server.match;

import com.kickr_server.dto.MatchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/next")
    public List<MatchDto> getNextMatches() throws Exception {
        return matchService.fetchNextMatches();
    }
}
