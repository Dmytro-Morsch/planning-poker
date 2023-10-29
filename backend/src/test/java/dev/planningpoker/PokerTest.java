package dev.planningpoker;

import dev.planningpoker.obfuscator.GameIdObfuscator;
import dev.planningpoker.obfuscator.PlayerIdObfuscator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.CoreMatchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class PokerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private GameIdObfuscator gameIdObfuscator;
    @Autowired
    private PlayerIdObfuscator playerIdObfuscator;

    @BeforeEach
    void beforeEach() {
        jdbcTemplate.update("DELETE FROM player");
        jdbcTemplate.update("DELETE FROM game");
        jdbcTemplate.update("ALTER SEQUENCE player_id_seq RESTART WITH 1");
        jdbcTemplate.update("ALTER SEQUENCE game_id_seq RESTART WITH 1");
    }

    @Test
    public void testCreateGame() throws Exception {
        // When a player creates a game it gets back gameId and playerId
        mockMvc.perform(post("/api/game").content("First Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameId").value(gameId(1)))
                .andExpect(jsonPath("$.playerId").value(playerId(1)));
    }

    @Test
    public void testAddPlayer() throws Exception {
        // One player creates a game
        mockMvc.perform(post("/api/game").content("First Player"))
                .andExpect(jsonPath("$.gameId").value(gameId(1)));

        // Another player joins the game and gets incremented id
        mockMvc.perform(
                        post("/api/game/{gameId}/player", gameId(1)).content("Second Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value(playerId(2)));
    }

    @Test
    public void testAddPlayerToNonExistingGame() throws Exception {
        // A new player joins a game with non-existing id 42
        mockMvc.perform(post("/api/game/42/player").content("Second Player"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testVote() throws Exception {
        // A player creates a game
        mockMvc.perform(post("/api/game").content("First Player"))
                .andExpect(jsonPath("$.gameId").value(gameId(1)));

        // The player votes
        mockMvc.perform(post("/api/player/{playerId}/vote", playerId(1)).content("5"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetGameWithHiddenVotes() throws Exception {
        // First player creates a game
        mockMvc.perform(post("/api/game").content("First Player"))
                .andExpect(jsonPath("$.gameId").value(gameId(1)));

        // Second player joins the game
        mockMvc.perform(post("/api/game/{gameId}/player", gameId(1)).content("Second Player"))
                .andExpect(jsonPath("$.playerId").value(playerId(2)));

        // Second player votes
        mockMvc.perform(post("/api/player/{playerId}/vote", playerId(2)).content("5"))
                .andExpect(status().isOk());

        // Get the game state
        mockMvc.perform(get("/api/game/{gameId}", gameId(1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playerId").value(playerId(1)))
                .andExpect(jsonPath("$[0].value").value(nullValue()))
                .andExpect(jsonPath("$[1].playerId").value(playerId(2)))
                .andExpect(jsonPath("$[1].value").value("*"));
    }

    @Test
    public void testGetGameWithRevealedVotes() throws Exception {
        // First player creates a game
        mockMvc.perform(post("/api/game").content("First Player"))
                .andExpect(jsonPath("$.gameId").value(gameId(1)));

        // Second player joins the game
        mockMvc.perform(post("/api/game/{gameId}/player", gameId(1)).content("Second Player"))
                .andExpect(jsonPath("$.playerId").value(playerId(2)));

        // Second player votes
        mockMvc.perform(post("/api/player/{playerId}/vote", playerId(2)).content("5"))
                .andExpect(status().isOk());

        // Someone opens all cards
        mockMvc.perform(post("/api/game/{gameId}/reveal", gameId(1)))
                .andExpect(status().isOk());

        // Get the game state
        mockMvc.perform(get("/api/game/{gameId}", gameId(1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playerId").value(playerId(1)))
                .andExpect(jsonPath("$[0].value").value(nullValue()))
                .andExpect(jsonPath("$[1].playerId").value(playerId(2)))
                .andExpect(jsonPath("$[1].value").value(5));
    }

    @Test
    public void testDuplicatePlayerName() throws Exception {
        // First player creates a game
        mockMvc.perform(post("/api/game").content("The Player"))
                .andExpect(jsonPath("$.gameId").value(gameId(1)));

        // Another player is trying to join with the same name
        mockMvc.perform(post("/api/game/{gameId}/player", gameId(1)).content("The Player"))
                .andExpect(status().isConflict());
    }

    private long gameId(int value) {
        return gameIdObfuscator.encode(value);
    }

    private long playerId(int value) {
        return playerIdObfuscator.encode(value);
    }
}
