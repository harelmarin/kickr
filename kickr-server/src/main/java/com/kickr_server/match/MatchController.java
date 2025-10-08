package com.kickr_server.match;

import com.kickr_server.dto.Match.MatchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.apache.logging.log4j.util.LambdaUtil.getAll;

@RestController
@RequestMapping("/api/matchs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping("/save")
    public void getNextMatches() throws Exception {
        matchService.fetchAndSaveNextMatches();
    }

    /**
     * Récupère les prochains matchs avec pagination.
     * @param page numéro de page (0-based)
     * @return page de MatchDto (10 par page)
     */
    @GetMapping("/next")
    public Page<MatchDto> getNextMatches(@RequestParam(defaultValue = "0") int page) {
        return matchService.getNextMatchesByDate(page);
    }

    @GetMapping
    public List<MatchDto> getAllMatches() {
        return matchService.getAll().stream()
                .map(MatchDto::fromEntity)
                .toList();
    }

}
