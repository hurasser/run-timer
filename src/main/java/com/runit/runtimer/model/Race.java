package com.runit.runtimer.model;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Race extends DomainObject {

    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
}
