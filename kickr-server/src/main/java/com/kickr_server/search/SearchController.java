package com.kickr_server.search;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Search API for users, teams, and competitions")
@RateLimiter(name = "userRateLimiter")
public class SearchController {

    private final SearchService searchService;

    /**
     * Search endpoint that returns matching users, teams, and competitions.
     *
     * @param query the search query string
     * @return SearchResponseDTO containing matching results
     */
    @GetMapping
    @Operation(summary = "Search across users, teams, and competitions", description = "Returns matching users, teams, and competitions based on the search query")
    public ResponseEntity<SearchResponseDTO> search(
            @Parameter(description = "Search query string", required = true) @RequestParam("q") String query) {
        SearchResponseDTO results = searchService.search(query);
        return ResponseEntity.ok(results);
    }
}
