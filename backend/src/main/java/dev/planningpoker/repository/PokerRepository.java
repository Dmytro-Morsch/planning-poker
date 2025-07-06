package dev.planningpoker.repository;

import dev.planningpoker.model.Vote;
import dev.planningpoker.obfuscator.GameIdObfuscator;
import dev.planningpoker.obfuscator.PlayerIdObfuscator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static java.util.Collections.emptyMap;
import static org.springframework.dao.support.DataAccessUtils.singleResult;

@Repository
public class PokerRepository {
    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;
    @Autowired
    private GameIdObfuscator gameIdObfuscator;
    @Autowired
    private PlayerIdObfuscator playerIdObfuscator;

    public Long createGame(Long ownerId) {
        Long gameId = nextGameId();
        jdbcTemplate.update("""
                insert into game (id, owner_id, revealed)
                values (:gameId, :ownerId, false)
                """, Map.of("gameId", gameId, "ownerId", ownerId));
        return gameId;
    }

    public Long getOwnerId(Long gameId) {
        List<Long> list = jdbcTemplate.queryForList("""
                select owner_id from game
                where id=:gameId
                """, Map.of("gameId", gameId), Long.class);
        return singleResult(list);
    }

    public List<Vote> getVotes(Long gameId) {
        return jdbcTemplate.query("""
                select * from player
                where game_id=:gameId
                order by id
                """, Map.of("gameId", gameId), this::mapVote);
    }

    public Long addPlayer(String playerName, Long gameId) {
        long playerId = nextPlayerId();
        addPlayer(playerId, playerName, gameId);
        return playerId;
    }

    public void addPlayer(Long playerId, String playerName, Long gameId) {
        var params = new MapSqlParameterSource()
                .addValue("playerId", playerId)
                .addValue("name", playerName)
                .addValue("gameId", gameId);
        jdbcTemplate.update("""
                insert into player (id, name, game_id)
                values (:playerId, :name, :gameId)
                """, params);
    }

    public boolean vote(Long playerId, String vote) {
        int updated = jdbcTemplate.update("""
                update player
                set vote=:vote
                where id=:playerId
                """, new MapSqlParameterSource("playerId", playerId).addValue("vote", vote));
        return updated > 0;
    }

    public boolean deletePlayer(Long playerId) {
        int updated = jdbcTemplate.update("""
                delete from player
                where id=:playerId
                """, Map.of("playerId", playerId));
        return updated > 0;
    }

    public Long getGameIdByPlayerId(Long playerId) {
        List<Long> list = jdbcTemplate.queryForList("""
                select game_id from player
                where id=:playerId
                """, Map.of("playerId", playerId), Long.class);
        return singleResult(list);
    }

    public boolean resetGame(Long gameId) {
        int updated = jdbcTemplate.update("""
                update player
                set vote=null
                where game_id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public boolean revealVotes(Long gameId) {
        int updated = jdbcTemplate.update("""
                update game
                set revealed=true
                where id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public boolean hideVotes(Long gameId) {
        int updated = jdbcTemplate.update("""
                update game
                set revealed=false
                where id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public Boolean areCardsRevealed(Long gameId) {
        List<Boolean> list = jdbcTemplate.queryForList("""
                select revealed from game where id=:gameId
                """, Map.of("gameId", gameId), Boolean.class);
        return singleResult(list);
    }

    public long nextPlayerId() {
        Long nextval = jdbcTemplate.queryForObject("""
                select nextval('player_id_seq')
                """, emptyMap(), Long.class);
        return playerIdObfuscator.encode(nextval);
    }

    private long nextGameId() {
        Long nextval = jdbcTemplate.queryForObject("""
                select nextval('game_id_seq')
                """, emptyMap(), Long.class);
        return gameIdObfuscator.encode(nextval);
    }

    private Vote mapVote(ResultSet rs, int rowNum) throws SQLException {
        Vote vote = new Vote();
        vote.playerId = rs.getLong("id");
        vote.playerName = rs.getString("name");
        vote.value = rs.getString("vote");
        return vote;
    }
}
