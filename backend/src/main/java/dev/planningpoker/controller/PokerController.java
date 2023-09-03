package dev.planningpoker.controller;

import dev.planningpoker.model.Vote;
import dev.planningpoker.repository.PokerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class PokerController {

    @Autowired
    private PokerRepository pokerRepository;

    @PostMapping("/api/game")
    private Map<String, Long> createGame(@RequestBody String playerName) {
        Long gameId = pokerRepository.createGame();
        Long playerId = pokerRepository.addPlayer(playerName, gameId);
        return Map.of("gameId", gameId, "playerId", playerId);
    }

    @PostMapping("/api/game/{gameId}/player")
    private ResponseEntity<?> joinGame(@PathVariable Long gameId,
                                       @RequestBody String playerName) {
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        if (revealed == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        try {
            Long playerId = pokerRepository.addPlayer(playerName, gameId);
            var votes = getVotes(gameId, revealed);
            return ResponseEntity.ok(Map.of("playerId", playerId, "votes", votes));
        } catch (DuplicateKeyException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Player with the same name has already joined the game");
        }
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

        var votes = getVotes(gameId, revealed);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/player/{playerId}/delete")
    private ResponseEntity<?> deletePlayer(@PathVariable Long playerId) {
        Long gameId = pokerRepository.getGameIdByPlayerId(playerId);
        if (!pokerRepository.deletePlayer(playerId)) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        var votes = getVotes(gameId, revealed);
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/api/game/{gameId}")
    private ResponseEntity<?> getVotes(@PathVariable Long gameId) {
        Boolean revealed = pokerRepository.areCardsRevealed(gameId);
        if (revealed == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }

        var votes = getVotes(gameId, revealed);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/game/{gameId}/reset")
    private ResponseEntity<?> resetGame(@PathVariable Long gameId) {
        boolean updated = pokerRepository.hideVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        pokerRepository.resetGame(gameId);
        var votes = getVotes(gameId, false);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/game/{gameId}/reveal")
    private ResponseEntity<?> revealVotes(@PathVariable Long gameId) {
        boolean updated = pokerRepository.revealVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var votes = getVotes(gameId, true);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/game/{gameId}/hide")
    private ResponseEntity<?> hideVotes(@PathVariable Long gameId) {
        boolean updated = pokerRepository.revealVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var votes = getVotes(gameId, true);
        return ResponseEntity.ok(votes);
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
