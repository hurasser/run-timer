package com.runit.runtimer.dto;

import com.runit.runtimer.model.Race;

public class RaceDto {
    public long startTime;
    public boolean isFinished;

    public RaceDto(Race race) {
        this.startTime = race.getStartTime().getTime();
        this.isFinished = race.isFinished();
    }
}
