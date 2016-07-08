package com.runit.runtimer.model;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
public abstract class DomainObject {

    private int id;
	private Date created;
    private Date lastUpdated;
    
    public DomainObject() {
    }
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
	public int getId() {
		return id;
	}
	
	void setId(int id) {
		this.id = id;
	}
	
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created")
    public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "lastUpdated")
	public Date getLastUpdated() {
		return lastUpdated;
	}
	
	public void setLastUpdated(Date updated) {
		this.lastUpdated = updated;
	}

	@PrePersist
	private void prePersist() {
		this.lastUpdated = new Date();
		this.created = new Date();
	}

	@PreUpdate
	private void preUpdate() {
		this.lastUpdated = new Date();
	}
}
