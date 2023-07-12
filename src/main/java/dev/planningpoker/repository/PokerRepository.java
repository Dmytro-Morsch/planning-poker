package dev.planningpoker.repository;

import dev.planningpoker.model.Vote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import static org.springframework.dao.support.DataAccessUtils.singleResult;

@Repository
public class PokerRepository {
    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public Long createGame() {
        var keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update("""
                insert into game (cards_shown)
                values (false)
                """, new MapSqlParameterSource(), keyHolder);
        return (long) keyHolder.getKeys().get("id");
    }

    public List<Vote> getVotes(Long gameId) {
        return jdbcTemplate.query("""
                select * from player 
                where game_id=:gameId
                order by id
                """, Map.of("gameId", gameId), this::mapVote);
    }

    public Long addPlayer(String playerName, Long gameId) {
        var keyHolder = new GeneratedKeyHolder();
        var params = new MapSqlParameterSource()
                .addValue("name", playerName)
                .addValue("gameId", gameId);

        jdbcTemplate.update("""
                insert into player (name, game_id)
                values (:name, :gameId)
                """, params, keyHolder);
        return (long) keyHolder.getKeys().get("id");
    }

    public boolean vote(Long playerId, String vote) {
        int updated = jdbcTemplate.update("""
                update player
                set vote=:vote
                where id=:playerId
                """, Map.of("vote", vote, "playerId", playerId));
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

    public boolean clearVotes(Long gameId) {
        int updated = jdbcTemplate.update("""
                update player
                set vote=null
                where game_id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public boolean showVotes(Long gameId) {
        int updated = jdbcTemplate.update("""
                update game
                set cards_shown=true
                where id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public boolean hideVotes(Long gameId) {
        int updated = jdbcTemplate.update("""
                update game
                set cards_shown=false
                where id=:gameId
                """, Map.of("gameId", gameId));
        return updated > 0;
    }

    public Boolean areCardsShown(Long gameId) {
        List<Boolean> list = jdbcTemplate.queryForList("""
                select cards_shown from game where id=:gameId
                """, Map.of("gameId", gameId), Boolean.class);
        return singleResult(list);
    }

    private Vote mapVote(ResultSet rs, int rowNum) throws SQLException {
        Vote vote = new Vote();
        vote.playerId = rs.getLong("id");
        vote.playerName = rs.getString("name");
        vote.value = rs.getString("vote");
        return vote;
    }
}
