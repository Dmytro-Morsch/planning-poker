package dev.planningpoker;

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

    @BeforeEach
    void beforeEach() {
        jdbcTemplate.update("DELETE FROM player");
        jdbcTemplate.update("DELETE FROM room");
        jdbcTemplate.update("ALTER SEQUENCE player_id_seq RESTART WITH 1");
        jdbcTemplate.update("ALTER SEQUENCE room_id_seq RESTART WITH 1");
    }

    @Test
    public void testCreateRoom() throws Exception {
        // When a player creates a room it gets back roomId and playerId
        mockMvc.perform(post("/api/room").content("First Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomId").value("1"))
                .andExpect(jsonPath("$.playerId").value("1"));
    }

    @Test
    public void testAddPlayer() throws Exception {
        // One player creates a room
        mockMvc.perform(post("/api/room").content("First Player"))
                .andExpect(jsonPath("$.roomId").value("1"));

        // Another player joins the room and gets incremented id
        mockMvc.perform(
                        post("/api/room/1/player").content("Second Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value("2"));
    }

    @Test
    public void testAddPlayerToNonExistingRoom() throws Exception {
        // A new player joins a room with non-existing id 42
        mockMvc.perform(post("/api/room/42/player").content("Second Player"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testVote() throws Exception {
        // A player creates a room
        mockMvc.perform(post("/api/room").content("First Player"))
                .andExpect(jsonPath("$.roomId").value("1"));

        // The player votes
        mockMvc.perform(post("/api/vote/1").content("5"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetRoomWithHiddenVotes() throws Exception {
        // First player creates a room
        mockMvc.perform(post("/api/room").content("First Player"))
                .andExpect(jsonPath("$.roomId").value("1"));

        // Second player joins the room
        mockMvc.perform(post("/api/room/1/player").content("Second Player"))
                .andExpect(jsonPath("$.playerId").value("2"));

        // Second player votes
        mockMvc.perform(post("/api/vote/2").content("5"))
                .andExpect(status().isOk());

        // Get the room state
        mockMvc.perform(get("/api/room/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['First Player']").value(nullValue()))
                .andExpect(jsonPath("$['Second Player']").value(-1));
    }

    @Test
    public void testGetRoomWithShownVotes() throws Exception {
        // First player creates a room
        mockMvc.perform(post("/api/room").content("First Player"))
                .andExpect(jsonPath("$.roomId").value("1"));

        // Second player joins the room
        mockMvc.perform(post("/api/room/1/player").content("Second Player"))
                .andExpect(jsonPath("$.playerId").value("2"));

        // Second player votes
        mockMvc.perform(post("/api/vote/2").content("5"))
                .andExpect(status().isOk());

        // Someone opens all cards
        mockMvc.perform(post("/api/room/1/show"))
                .andExpect(status().isOk());

        // Get the room state
        mockMvc.perform(get("/api/room/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$['First Player']").value(nullValue()))
                .andExpect(jsonPath("$['Second Player']").value(5));
    }
}
