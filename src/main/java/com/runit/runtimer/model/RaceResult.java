package com.runit.runtimer.model;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class RaceResult extends DomainObject {

    private int runnerNumber;
    private int timeInMillis;

    public RaceResult() {}

    public RaceResult(int runnerNumber, int timeInSeconds) {
        this.runnerNumber = runnerNumber;
        this.timeInMillis = timeInSeconds;
    }

    @Column
    public int getRunnerNumber() {
        return runnerNumber;
    }

    public void setRunnerNumber(int runnerNumber) {
        this.runnerNumber = runnerNumber;
    }

    @Column
    public int getTimeInMillis() {
        return timeInMillis;
    }

    public void setTimeInMillis(int timeInMillis) {
        this.timeInMillis = timeInMillis;
    }
}
