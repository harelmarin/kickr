package com.kickr_server.config;

import com.kickr_server.user.Role;
import com.kickr_server.user.User;
import com.kickr_server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration pour initialiser les données de base au démarrage de
 * l'application.
 * Équivalent d'un seed.ts en NestJS.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "kickr.seed.enabled", havingValue = "true", matchIfMissing = false)
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.kickr_server.match.MatchRepository matchRepository;
    private final com.kickr_server.usermatch.UserMatchRepository userMatchRepository;
    private final com.kickr_server.follow.FollowRepository followRepository;
    private final com.kickr_server.usermatch.ReviewCommentRepository reviewCommentRepository;

    @org.springframework.beans.factory.annotation.Value("${admin.name:Marin}")
    private String adminName;

    @org.springframework.beans.factory.annotation.Value("${admin.email:yubi2a1812@gmail.com}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${admin.password:Marinpierre1812!}")
    private String adminPassword;

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            log.info("🌱 Starting database seeding...");

            // 1. Create Default Admin
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName(adminName);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                log.info("✅ Admin user created: " + adminEmail);
            }

            // 2. Create 60 Chaotic & Realistic Users
            String[][] userIdentities = {
                    { "James Sterling", "sterling_james" }, { "Sophie Rodriguez", "soph_soccer" },
                    { "Marcus Thorne", "th0rne_tactics" },
                    { "Elena Van Dijk", "elena_vdj" }, { "Julian Moretti", "jules_fm" },
                    { "Aria O'Connor", "aria_football" },
                    { "Thorne Schmidt", "schmidt_analysis" }, { "Isabella Dubois", "bella_goal" },
                    { "Kael Kovacs", "kael_k" },
                    { "Maya Saito", "maya_tactician" }, { "Liam Walker", "liam_w_fc" }, { "Olivia Hall", "olivia_h" },
                    { "Noah Young", "noah_goal" }, { "Emma King", "emma_football" }, { "Lucas Wright", "lucas_w" },
                    { "Ava Baker", "ava_b_99" }, { "Ethan Adams", "ethan_adams_" },
                    { "Sophia Campbell", "soph_campbell" },
                    { "Mason Phillips", "mason_p" }, { "Mia Evans", "mia_evans_x" }, { "Logan Turner", "logan_t" },
                    { "Charlotte Parker", "charlie_p" }, { "Caleb Collins", "caleb_c" },
                    { "Amelia Edwards", "amelia_e" },
                    { "Jack Stewart", "jack_s_utd" }, { "Harper Morris", "harper_m" },
                    { "PenaltyMerchant", "pen_merchant" },
                    { "Kloppite99", "kloppite_99" }, { "TacticalWizard", "tactic_wiz" },
                    { "TheRealMarcus", "real_marcus" },
                    // 30 New Identities
                    { "ZizouMagic", "zizou_magic" }, { "BarcaFan01", "fcb_fan_01" },
                    { "TacticalGooner", "tactical_gooner" },
                    { "Madridista_Hala", "hala_madrid_92" }, { "TheSpecialOne", "special_one_fc" },
                    { "PressingMachine", "press_machine" },
                    { "TransferNewsLive", "transfer_news_l" }, { "VAR_Hater", "var_hater_88" },
                    { "CornerFlag", "corner_flag_fc" },
                    { "FalseNine", "false_nine_analytic" }, { "Box2BoxJoe", "joe_box2box" },
                    { "WingBackLeo", "leo_wb" },
                    { "SweeperKeeper", "sweeper_k_99" }, { "DoublePivotSam", "sam_dp" },
                    { "HalfSpaceHacker", "hs_hacker" },
                    { "LowBlockMaster", "low_block_m" }, { "InvertedWinger", "inv_winger_99" },
                    { "Raumdeuter", "raumdeuter_fc" },
                    { "TikiTakaSophie", "sophie_tiki" }, { "GengenPressMax", "max_press" },
                    { "ParkTheBusSam", "sam_bus_parker" },
                    { "DirectFootballRoy", "roy_direct" }, { "TotalFootballJohan", "jojan_total" },
                    { "CatennacioLuca", "luca_catennacio" },
                    { "JogaBonitoNey", "ney_joga_b" }, { "RabonaQueen", "rabona_q" }, { "PanenkaPro", "panenka_pro" },
                    { "NutmegCentral", "nutmeg_central" }, { "CleanSheetChris", "chris_cs" },
                    { "TheWhistle", "the_whistle_ref" }
            };

            java.util.List<User> seededUsers = new java.util.ArrayList<>();
            for (int i = 0; i < userIdentities.length; i++) {
                String name = userIdentities[i][0];
                String handle = userIdentities[i][1];
                String sanitizedPart = handle.toLowerCase().replaceAll("[^a-z0-9]", "");
                String email = sanitizedPart + "@example.com";

                if (!userRepository.existsByEmail(email) && !userRepository.existsByName(name)) {
                    User user = new User();
                    user.setName(name);
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode("Kickr2026!"));
                    user.setRole(Role.USER);
                    // Add Avatar from Pravatar (using index for variety)
                    user.setAvatarUrl("https://i.pravatar.cc/150?u=" + sanitizedPart);
                    userRepository.save(user);
                    seededUsers.add(user);
                } else {
                    userRepository.findByEmail(email).ifPresent(u -> {
                        if (u.getAvatarUrl() == null) {
                            u.setAvatarUrl("https://i.pravatar.cc/150?u=" + sanitizedPart);
                            userRepository.save(u);
                        }
                        seededUsers.add(u);
                    });
                    if (!userRepository.existsByEmail(email)) {
                        userRepository.findByName(name).ifPresent(u -> {
                            if (!seededUsers.contains(u))
                                seededUsers.add(u);
                        });
                    }
                }
            }
            log.info("✅ {} chaotic users verified/created with avatars", seededUsers.size());

            // 3. Follow Relationships (Random graph)
            if (followRepository.count() < 150) {
                java.util.Random random = new java.util.Random();
                for (User follower : seededUsers) {
                    int followCount = 5 + random.nextInt(10);
                    for (int j = 0; j < followCount; j++) {
                        User followed = seededUsers.get(random.nextInt(seededUsers.size()));
                        if (!follower.equals(followed)
                                && !followRepository.existsByFollowerAndFollowed(follower, followed)) {
                            com.kickr_server.follow.Follow follow = com.kickr_server.follow.Follow.builder()
                                    .follower(follower)
                                    .followed(followed)
                                    .build();
                            followRepository.save(follow);
                        }
                    }
                }
                log.info("✅ Mutual follow relationships created");
            }

            // 4. Match Reviews (Chaotic Realism: Slang, Typos, Memes)
            java.util.List<com.kickr_server.match.Match> finishedMatches = matchRepository.findAll().stream()
                    .filter(m -> m.getHomeScore() != null)
                    .limit(40)
                    .toList();

            if (!finishedMatches.isEmpty() && userMatchRepository.count() < 80) {
                String[] chaoticReviews = {
                        "This team is cooked fr. No tactics just vibes lmao",
                        "HE'S THE GOAT!! What a finish! 🐐⚽",
                        "Absolute robbery by the ref, shld have been a pen 😤",
                        "Low block was clinical today. Tactical masterclass from the gaffer.",
                        "L + ratio + your striker is washed",
                        "Scenes at the 90th min!! BALLER!!",
                        "ikr, the defance was sleeping the whole match...",
                        "standard performance, nothing special but we take the 3 points",
                        "missed too many chances smh, shld have won 4-0",
                        "this is why we love the beautiful game! Pure magic!!",
                        "Var is ruining football fr, that decision was a joke",
                        "transition play was fire today, they didn't let them breath",
                        "midfield was ghosting all game, we need new signings asap",
                        "can't believe we lost like that, heartbraking...",
                        "best goal i've seen in years, proper thundercunt that one"
                };

                java.util.Random random = new java.util.Random();
                java.util.List<com.kickr_server.usermatch.UserMatch> createdReviews = new java.util.ArrayList<>();

                for (com.kickr_server.match.Match match : finishedMatches) {
                    int reviewCount = 3 + random.nextInt(5);
                    for (int j = 0; j < reviewCount; j++) {
                        User reviewer = seededUsers.get(random.nextInt(seededUsers.size()));
                        if (!userMatchRepository.existsByUserAndMatch(reviewer, match)) {
                            com.kickr_server.usermatch.UserMatch review = com.kickr_server.usermatch.UserMatch.builder()
                                    .user(reviewer)
                                    .match(match)
                                    .note(1.0 + random.nextInt(9) * 0.5)
                                    .comment(chaoticReviews[random.nextInt(chaoticReviews.length)])
                                    .isLiked(random.nextBoolean())
                                    .likesCount(random.nextInt(50))
                                    .build();
                            userMatchRepository.save(review);
                            createdReviews.add(review);
                        }
                    }
                }
                log.info("✅ Chaotic match reviews created");

                // 5. Chaotic Comments
                String[] commentPool = {
                        "facts", "ratio", "W take", "L opinion", "ikr!!", "lmao fr",
                        "stfu you know nothing about ball", "spot on mate", "cope harder",
                        "this!", "imagine thinking this...", "based", "finally someone said it"
                };

                for (com.kickr_server.usermatch.UserMatch review : createdReviews) {
                    if (random.nextInt(10) < 7) { // 70% chance of engagement
                        int replyCount = 1 + random.nextInt(4);
                        for (int k = 0; k < replyCount; k++) {
                            User commenter = seededUsers.get(random.nextInt(seededUsers.size()));
                            if (!commenter.equals(review.getUser())) {
                                com.kickr_server.usermatch.ReviewComment rc = com.kickr_server.usermatch.ReviewComment
                                        .builder()
                                        .userMatch(review)
                                        .user(commenter)
                                        .content(commentPool[random.nextInt(commentPool.length)])
                                        .build();
                                reviewCommentRepository.save(rc);
                            }
                        }
                    }
                }
                log.info("✅ Chaotic discussion threads seeded");
            }

            log.info("🎉 Database seeding completed!");
        };
    }
}
