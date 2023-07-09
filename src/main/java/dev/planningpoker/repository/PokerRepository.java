package dev.planningpoker.repository;

import dev.planningpoker.Vote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
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

    public List<Vote> getVotes(Long roomId) {
        return jdbcTemplate.query("""
                select * from player 
                where room_id=:roomId
                order by id
                """, Map.of("roomId", roomId), this::mapVote);
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
                set cards_shown=true
                where id=:roomId
                """, Map.of("roomId", roomId));
    }

    public void hideVotes(Long roomId) {
        jdbcTemplate.update("""
                update room
                set cards_shown=false
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

    private Vote mapVote(ResultSet rs, int rowNum) throws SQLException {
        Vote vote = new Vote();
        vote.playerId = rs.getLong("id");
        vote.playerName = rs.getString("name");
        vote.value = rs.getObject("vote", Integer.class);
        return vote;
    }
}
