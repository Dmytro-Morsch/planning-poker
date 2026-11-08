package dev.planningpoker.controller;

import dev.planningpoker.model.Vote;
import dev.planningpoker.repository.PokerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class PlayerIdSerializationTest {
    // The first integer that JavaScript's Number cannot represent exactly.
    private static final long PLAYER_ID = 9007199254740993L;
    private static final String PLAYER_ID_TEXT = "9007199254740993";
    private PokerRepository repository;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        repository = mock(PokerRepository.class);
        var controller = new RestApiController();
        ReflectionTestUtils.setField(controller, "pokerRepository", repository);
        mvc = MockMvcBuilders.standaloneSetup(controller).build();

        var vote = new Vote();
        vote.playerId = PLAYER_ID;
        vote.playerName = "Player";
        when(repository.areCardsRevealed(1L)).thenReturn(false);
        when(repository.getOwnerId(1L)).thenReturn(PLAYER_ID);
        when(repository.getVotes(1L)).thenReturn(List.of(vote));
    }

    @Test
    void creationReturnsPlayerIdAsStringAndGameIdAsNumber() throws Exception {
        when(repository.nextPlayerId()).thenReturn(PLAYER_ID);
        when(repository.createGame(PLAYER_ID)).thenReturn(1L);

        mvc.perform(post("/api/game").content("Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameId").value(1))
                .andExpect(jsonPath("$.playerId").value(PLAYER_ID_TEXT));
    }

    @Test
    void joiningAndPollingReturnAllPlayerIdsAsStrings() throws Exception {
        when(repository.addPlayer("Player", 1L)).thenReturn(PLAYER_ID);

        mvc.perform(post("/api/game/1/player").content("Player"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value(PLAYER_ID_TEXT))
                .andExpect(jsonPath("$.ownerId").value(PLAYER_ID_TEXT))
                .andExpect(jsonPath("$.votes[0].playerId").value(PLAYER_ID_TEXT));

        mvc.perform(get("/api/game/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ownerId").value(PLAYER_ID_TEXT))
                .andExpect(jsonPath("$.votes[0].playerId").value(PLAYER_ID_TEXT));
    }

    @Test
    void returnedPlayerIdCanBeUsedForVotingAndDeletionWithoutPrecisionLoss() throws Exception {
        when(repository.nextPlayerId()).thenReturn(PLAYER_ID);
        when(repository.createGame(PLAYER_ID)).thenReturn(1L);
        var result = mvc.perform(post("/api/game").content("Player"))
                .andExpect(status().isOk()).andReturn();
        var id = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(result.getResponse().getContentAsString()).get("playerId").textValue();
        when(repository.vote(PLAYER_ID, "5")).thenReturn(true);
        when(repository.getGameIdByPlayerId(PLAYER_ID)).thenReturn(1L);
        when(repository.deletePlayer(PLAYER_ID)).thenReturn(true);

        mvc.perform(post("/api/player/{id}/vote", id).content("5"))
                .andExpect(status().isOk());
        mvc.perform(post("/api/player/{id}/delete", id))
                .andExpect(status().isOk());

        verify(repository).vote(PLAYER_ID, "5");
        verify(repository).deletePlayer(PLAYER_ID);
    }
}
