package com.runit.runtimer.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Race extends DomainObject {

    private Date startTime;
    private boolean finished;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Column
    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }
}
