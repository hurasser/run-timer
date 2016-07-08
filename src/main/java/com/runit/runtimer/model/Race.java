package com.runit.runtimer.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Race extends DomainObject {

    private Date startTime;

    public Date getStartTime() {
        return startTime;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
}
