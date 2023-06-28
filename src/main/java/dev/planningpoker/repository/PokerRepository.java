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

    public Map<String, Integer> getBets(Long roomId) {
        Map<String, Integer> result = new HashMap<>();

        jdbcTemplate.query("""
                select * from player where room_id=:roomId
                """, Map.of("roomId", roomId), rs -> {
            String playerName = rs.getString("name");
            Integer bet = rs.getObject("bet", Integer.class);
            result.put(playerName, bet);
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

    public boolean placeBet(Long playerId, Integer bet) {
        int update = jdbcTemplate.update("""
                update player
                set bet=:bet
                where id=:playerId
                """, Map.of("bet", bet, "playerId", playerId));
        return update > 0;
    }

    public void clearBets(Long roomId) {
        jdbcTemplate.update("""
                update player
                set bet=null
                where room_id=:roomId
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
}
