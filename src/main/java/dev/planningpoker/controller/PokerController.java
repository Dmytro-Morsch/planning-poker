package dev.planningpoker.controller;

import dev.planningpoker.model.Vote;
import dev.planningpoker.repository.PokerRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        Boolean shown = pokerRepository.areCardsShown(gameId);
        if (shown == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        Long playerId = pokerRepository.addPlayer(playerName, gameId);
        var votes = getVotes(gameId, shown);
        return ResponseEntity.ok(Map.of("playerId", playerId, "votes", votes));
    }

    @PostMapping("/api/player/{playerId}/vote")
    private ResponseEntity<?> vote(@PathVariable Long playerId,
                                   @RequestBody String value) {
        if (!pokerRepository.vote(playerId, value)) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }

        Long gameId = pokerRepository.getGameIdByPlayerId(playerId);
        Boolean shown = pokerRepository.areCardsShown(gameId);
        if (shown == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }

        var votes = getVotes(gameId, shown);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/player/{playerId}/delete")
    private ResponseEntity<?> deletePlayer(@PathVariable Long playerId) {
        Long gameId = pokerRepository.getGameIdByPlayerId(playerId);
        if (!pokerRepository.deletePlayer(playerId)) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }
        Boolean shown = pokerRepository.areCardsShown(gameId);
        var votes = getVotes(gameId, shown);
        return ResponseEntity.ok(votes);
    }

    @GetMapping("/api/game/{gameId}")
    private ResponseEntity<?> getVotes(@PathVariable Long gameId) {
        Boolean shown = pokerRepository.areCardsShown(gameId);
        if (shown == null) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }

        var votes = getVotes(gameId, shown);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/game/{gameId}/clear")
    private ResponseEntity<?> clearVotes(@PathVariable Long gameId) {
        boolean updated = pokerRepository.hideVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        pokerRepository.clearVotes(gameId);
        var votes = getVotes(gameId, false);
        return ResponseEntity.ok(votes);
    }

    @PostMapping("/api/game/{gameId}/show")
    private ResponseEntity<?> showVotes(@PathVariable Long gameId) {
        boolean updated = pokerRepository.showVotes(gameId);
        if (!updated) {
            return new ResponseEntity<>("Game not found!", HttpStatus.NOT_FOUND);
        }
        var votes = getVotes(gameId, true);
        return ResponseEntity.ok(votes);
    }

    private List<Vote> getVotes(Long gameId, boolean shown) {
        var votes = pokerRepository.getVotes(gameId);
        if (!shown) {
            for (Vote vote : votes) {
                if (vote.value != null) {
                    vote.value = "*";
                }
            }
        }
        return votes;
    }
}
