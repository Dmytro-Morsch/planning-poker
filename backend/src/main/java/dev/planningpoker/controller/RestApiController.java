package dev.planningpoker.controller;

import dev.planningpoker.model.Vote;
import dev.planningpoker.repository.PokerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RestApiController {

    @Autowired
    private PokerRepository pokerRepository;

    @PostMapping("/api/game")
    private Map<String, Long> createGame(@RequestBody String playerName) {
        Long ownerId = pokerRepository.nextPlayerId();
        Long gameId = pokerRepository.createGame(ownerId);
        pokerRepository.addPlayer(ownerId, playerName, gameId);
        return Map.of("gameId", gameId, "playerId", ownerId);
    }

    @PostMapping("/api/game/{gameId}/player")
    private ResponseEntity<?> joinGame(@PathVariable Long gameId,
                                       @RequestBody String playerName) {
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        if (revealed == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var body = new HashMap<>(getGame(gameId, revealed));
        try {
            body.put("playerId", pokerRepository.addPlayer(playerName, gameId));
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Player with the same name has already joined the game");
        }
        return ResponseEntity.ok(body);
    }

    @PostMapping("/api/player/{playerId}/vote")
    private ResponseEntity<?> vote(@PathVariable Long playerId,
                                   @RequestBody(required = false) String value) {
        if (!pokerRepository.vote(playerId, value)) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }

        Long gameId = pokerRepository.getGameIdByPlayerId(playerId);
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        if (revealed == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var body = getGame(gameId, revealed);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/api/player/{playerId}/delete")
    private ResponseEntity<?> deletePlayer(@PathVariable Long playerId) {
        Long gameId = pokerRepository.getGameIdByPlayerId(playerId);
        if (!pokerRepository.deletePlayer(playerId)) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        var body = getGame(gameId, revealed);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/api/game/{gameId}")
    private ResponseEntity<?> getGame(@PathVariable Long gameId) {
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        if (revealed == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var body = getGame(gameId, revealed);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/api/game/{gameId}/reset")
    private ResponseEntity<?> resetGame(@PathVariable Long gameId) {
        boolean updated = pokerRepository.hideVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        pokerRepository.resetGame(gameId);
        var body = getGame(gameId, false);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/api/game/{gameId}/reveal")
    private ResponseEntity<?> revealVotes(@PathVariable Long gameId) {
        boolean updated = pokerRepository.revealVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var body = getGame(gameId, true);
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> getGame(Long gameId, boolean revealed) {
        var ownerId = pokerRepository.getOwnerId(gameId);
        var votes = getVotes(gameId, revealed);
        return Map.of(
                "ownerId", ownerId,
                "revealed", revealed,
                "votes", votes);
    }

    private List<Vote> getVotes(Long gameId, boolean revealed) {
        var votes = pokerRepository.getVotes(gameId);
        if (!revealed) {
            for (Vote vote : votes) {
                if (vote.value != null) {
                    vote.value = "*";
                }
            }
        }
        return votes;
    }
}
