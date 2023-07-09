package dev.planningpoker.controller;

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

    @PostMapping("/api/room")
    private Map<String, Long> createRoom(@RequestBody String playerName) {
        Long roomId = pokerRepository.createRoom();
        Long playerId = pokerRepository.addPlayer(playerName, roomId);
        return Map.of("roomId", roomId, "playerId", playerId);
    }

    @PostMapping("/api/room/{roomId}/player")
    private ResponseEntity<?> addPlayerToRoom(@PathVariable Long roomId,
                                              @RequestBody String playerName) {
        Boolean shown = pokerRepository.areCardsShown(roomId);
        if (shown == null) {
            return new ResponseEntity<>("Room not found!", HttpStatus.NOT_FOUND);
        }
        Long playerId = pokerRepository.addPlayer(playerName, roomId);
        Map<String, Integer> bets = getBets(roomId, shown);
        return ResponseEntity.ok(Map.of("playerId", playerId, "bets", bets));
    }

    @PostMapping("/api/bet/{playerId}")
    private ResponseEntity<?> placeBet(@PathVariable Long playerId,
                                       @RequestBody String bet) {
        if (!pokerRepository.placeBet(playerId, Integer.parseInt(bet))) {
            return new ResponseEntity<>("Player not found!", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/room/{roomId}")
    private ResponseEntity<?> getBets(@PathVariable Long roomId) {
        Boolean shown = pokerRepository.areCardsShown(roomId);
        if (shown == null) {
            return new ResponseEntity<>("Room not found!", HttpStatus.NOT_FOUND);
        }

        Map<String, Integer> bets = getBets(roomId, shown);
        return ResponseEntity.ok(bets);
    }

    private Map<String, Integer> getBets(Long roomId, Boolean shown) {
        Map<String, Integer> bets = pokerRepository.getBets(roomId);
        if (!shown) {
            for (String player : bets.keySet()) {
                if (bets.get(player) != null) {
                    bets.put(player, -1);
                }
            }
        }
        return bets;
    }

    @GetMapping("/api/room/{roomId}/players")
    private ResponseEntity<?> getPlayers(@PathVariable Long roomId) {
        if (!pokerRepository.roomExists(roomId)) {
            return new ResponseEntity<>("Room not found!", HttpStatus.NOT_FOUND);
        }
        List<Long> playersId = pokerRepository.getPlayersId(roomId);
        return ResponseEntity.ok(playersId);
    }

    @PostMapping("/api/room/{roomId}/clear")
    private ResponseEntity<?> clearBets(@PathVariable Long roomId) {
        if (!pokerRepository.roomExists(roomId)) {
            return new ResponseEntity<>("Room not found!", HttpStatus.NOT_FOUND);
        }
        pokerRepository.clearBets(roomId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/api/room/{roomId}/show")
    private ResponseEntity<?> showBets(@PathVariable Long roomId) {
        if (!pokerRepository.roomExists(roomId)) {
            return new ResponseEntity<>("Room not found!", HttpStatus.NOT_FOUND);
        }
        pokerRepository.showBets(roomId);
        return ResponseEntity.noContent().build();
    }
}
