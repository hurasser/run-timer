package com.runit.runtimer.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class RaceResult extends DomainObject {

    private int runnerNumber;
    private int timeInSeconds;

    public int getRunnerNumber() {
        return runnerNumber;
    }

    @Column
    public void setRunnerNumber(int runnerNumber) {
        this.runnerNumber = runnerNumber;
    }

    public int getTimeInSeconds() {
        return timeInSeconds;
    }

    @Column
    public void setTimeInSeconds(int timeInSeconds) {
        this.timeInSeconds = timeInSeconds;
    }
}
