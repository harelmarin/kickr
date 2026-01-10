package com.kickr_server.security;

import com.kickr_server.auth.AuthService;
import com.kickr_server.dto.Auth.AuthRequest;
import com.kickr_server.dto.UserMatch.UserMatchDto;
import com.kickr_server.user.Role;
import com.kickr_server.user.User;
import com.kickr_server.user.UserService;
import com.kickr_server.usermatch.UserMatch;
import com.kickr_server.usermatch.UserMatchRepository;
import com.kickr_server.match.Match;
import com.kickr_server.match.MatchRepository;
import com.kickr_server.team.Team;
import com.kickr_server.team.TeamRepository;
import com.kickr_server.competitions.Competition;
import com.kickr_server.competitions.CompetitionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class UserMatchIdorSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMatchRepository userMatchRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String userAToken;
    private String userBToken;
    private String adminToken;
    private UUID userAId;
    private UUID userBId;
    private Match savedMatch;

    @BeforeEach
    void setUp() {
        // Create Competition first (required by Team and Match)
        Competition competition = competitionRepository.save(Competition.builder()
                .name("Test League IDOR")
                .country("Test Country")
                .externalId(99999)
                .build());

        // Create Teams
        Team teamA = teamRepository.save(Team.builder()
                .name("Team A IDOR")
                .competition(competition)
                .externalId(11111)
                .build());
        Team teamB = teamRepository.save(Team.builder()
                .name("Team B IDOR")
                .competition(competition)
                .externalId(22222)
                .build());

        // Create Match
        Match match = Match.builder()
                .homeTeam(teamA)
                .awayTeam(teamB)
                .competition(competition)
                .matchDate(LocalDateTime.now())
                .location("Test Stadium")
                .externalFixtureId(123456)
                .build();
        savedMatch = matchRepository.save(match);

        // Create User A
        User userA = new User();
        userA.setName("userA_IDOR");
        userA.setEmail("usera_idor@test.com");
        userA.setPassword(passwordEncoder.encode("Pass123!"));
        userA.setRole(Role.USER);
        userA = userService.save(userA);
        userAId = userA.getId();

        // Create User B
        User userB = new User();
        userB.setName("userB_IDOR");
        userB.setEmail("userb_idor@test.com");
        userB.setPassword(passwordEncoder.encode("Pass123!"));
        userB.setRole(Role.USER);
        userB = userService.save(userB);
        userBId = userB.getId();

        // Create Admin
        User admin = new User();
        admin.setName("adminUser_IDOR");
        admin.setEmail("admin_idor@test.com");
        admin.setPassword(passwordEncoder.encode("AdminPass123!"));
        admin.setRole(Role.ADMIN);
        userService.save(admin);

        // Get Tokens
        userAToken = authService.authenticate(new AuthRequest("userA_IDOR", "Pass123!")).token();
        userBToken = authService.authenticate(new AuthRequest("userB_IDOR", "Pass123!")).token();
        adminToken = authService.authenticate(new AuthRequest("adminUser_IDOR", "AdminPass123!")).token();
    }

    @Test
    @DisplayName("User B cannot delete User A's review")
    void testUserBCannotDeleteUserAReview() throws Exception {
        // User A creates a review
        UserMatch review = UserMatch.builder()
                .user(userService.getUserById(userAId))
                .match(savedMatch)
                .note(4.0)
                .comment("Great match!")
                .build();
        review = userMatchRepository.save(review);
        UUID reviewId = review.getId();

        // User B tries to delete it
        mockMvc.perform(delete("/api/user_match/" + reviewId)
                .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isForbidden());

        // Verify it still exists
        assertEquals(true, userMatchRepository.existsById(reviewId));
    }

    @Test
    @DisplayName("Admin can delete User A's review")
    void testAdminCanDeleteUserAReview() throws Exception {
        // User A creates a review
        UserMatch review = UserMatch.builder()
                .user(userService.getUserById(userAId))
                .match(savedMatch)
                .note(4.0)
                .comment("Great match!")
                .build();
        review = userMatchRepository.save(review);
        UUID reviewId = review.getId();

        // Admin deletes it
        mockMvc.perform(delete("/api/user_match/" + reviewId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Verify it's gone
        assertEquals(false, userMatchRepository.existsById(reviewId));
    }

    @Test
    @DisplayName("User A creates a review - it should be assigned to User A even if userId is manipulated")
    void testUserACreationIsAssignedToUserA() throws Exception {
        UserMatchDto dto = new UserMatchDto();
        dto.matchId = savedMatch.getId();
        dto.note = 4.5;
        dto.comment = "Good game IDOR";
        dto.userId = userBId; // Try to attribute to User B

        mockMvc.perform(post("/api/user_match")
                .header("Authorization", "Bearer " + userAToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Find the created review
        UserMatch created = userMatchRepository.findAll().stream()
                .filter(rm -> rm.getComment().equals("Good game IDOR"))
                .findFirst().orElseThrow();

        // Verify it belongs to User A
        assertEquals(userAId, created.getUser().getId());
    }
}
