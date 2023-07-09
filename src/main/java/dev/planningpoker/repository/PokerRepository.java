package dev.planningpoker.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PokerRepository {
    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    public Long createRoom() {
        var keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update("""
                insert into room (cards_shown)
                values (false)
                """, new MapSqlParameterSource(), keyHolder);
        return (long) keyHolder.getKeys().get("id");
    }

    public Map<String, Integer> getVotes(Long roomId) {
        Map<String, Integer> result = new HashMap<>();

        jdbcTemplate.query("""
                select * from player where room_id=:roomId
                """, Map.of("roomId", roomId), rs -> {
            String playerName = rs.getString("name");
            Integer vote = rs.getObject("vote", Integer.class);
            result.put(playerName, vote);
        });
        return result;
    }

    public Long addPlayer(String playerName, Long roomId) {
        var keyHolder = new GeneratedKeyHolder();
        var params = new MapSqlParameterSource()
                .addValue("name", playerName)
                .addValue("roomId", roomId);

        jdbcTemplate.update("""
                insert into player (name, room_id)
                values (:name, :roomId)
                """, params, keyHolder);
        return (long) keyHolder.getKeys().get("id");
    }

    public boolean vote(Long playerId, Integer vote) {
        int update = jdbcTemplate.update("""
                update player
                set vote=:vote
                where id=:playerId
                """, Map.of("vote", vote, "playerId", playerId));
        return update > 0;
    }

    public Long getRoomIdByPlayerId(Long playerId) {
        List<Long> list = jdbcTemplate.queryForList("""
                select room_id from player
                where id=:playerId
                """, Map.of("playerId", playerId), Long.class);
        return DataAccessUtils.singleResult(list);
    }

    public void clearVotes(Long roomId) {
        jdbcTemplate.update("""
                update player
                set vote=null
                where room_id=:roomId
                """, Map.of("roomId", roomId));
    }

    public void showVotes(Long roomId) {
        jdbcTemplate.update("""
                update room
                set cards_shown=not cards_shown
                where id=:roomId
                """, Map.of("roomId", roomId));
    }

    @SuppressWarnings("DataFlowIssue")
    public boolean roomExists(Long roomId) {
        return jdbcTemplate.queryForObject("""
                select exists(select 1 from room where id=:roomId)
                """, Map.of("roomId", roomId), Boolean.class);
    }

    public Boolean areCardsShown(Long roomId) {
        List<Boolean> list = jdbcTemplate.queryForList("""
                select cards_shown from room where id=:roomId
                """, Map.of("roomId", roomId), Boolean.class);
        return DataAccessUtils.singleResult(list);
    }

    public List<Long> getPlayersId(Long roomId) {
        return jdbcTemplate.queryForList("""
                select id from player where room_id=:roomId
                """, Map.of("roomId", roomId), Long.class);
    }
}
