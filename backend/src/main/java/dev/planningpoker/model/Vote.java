package dev.planningpoker.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public class Vote {
    @JsonSerialize(using = ToStringSerializer.class)
    public Long playerId;
    public String playerName;
    public String value;
}
