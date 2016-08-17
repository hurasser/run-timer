package com.runit.runtimer.repository;

import com.runit.runtimer.model.Race;
import com.runit.runtimer.model.RaceResult;
import com.runit.runtimer.model.Runner;
import com.runit.runtimer.model.category.ResultCategory;

import javax.ejb.Stateless;
import javax.persistence.*;
import java.util.List;

@Stateless
public class RaceRepository {

    private static final int MAX_RESULTS_FOR_LATEST = 10;
    private static final int MAX_RESULTS_FOR_CATRGORY = 5;
    @PersistenceContext(unitName = "run-timer-persistance-unit")
    private EntityManager em;

    public List<Race> getActiveRaces() {
        TypedQuery<Race> query = em.createQuery("SELECT r FROM Race r WHERE r.startTime IS NOT NULL", Race.class);
        return query.getResultList();
    }

    public Race getRace() {
        TypedQuery<Race> query = em.createQuery("SELECT r FROM Race r", Race.class);
        List<Race> races = query.getResultList();
        if (races.size() == 1) return races.get(0);
        return null;
    }

    public void saveResults(List<RaceResult> results) {
        for (RaceResult r : results) {
            em.persist(r);
        }
    }

    public List<RaceResult> getLatestResults() {
        TypedQuery<RaceResult> query = em.createQuery("SELECT rr FROM RaceResult rr ORDER BY rr.timeInMillis desc ", RaceResult.class);
        query.setMaxResults(MAX_RESULTS_FOR_LATEST);
        return query.getResultList();
    }

    public Runner getRunnerById(int id) {
        return em.find(Runner.class, id);
    }

    public Runner getRunnerByNumber(int runnerNumber) {
        TypedQuery<Runner> query = em.createQuery("SELECT r FROM Runner r WHERE r.runnerNumber = :runnerNumber", Runner.class);
        query.setParameter("runnerNumber", runnerNumber);
        try {
            return query.getSingleResult();
        } catch (NoResultException | NonUniqueResultException e) {
            return null;
        }
    }

    public List<Runner> getLatestRunners() {
        TypedQuery<Runner> query = em.createQuery("SELECT r FROM Runner r WHERE r.resultInMillis IS NOT NULL ORDER BY r.resultInMillis desc", Runner.class);
        query.setMaxResults(MAX_RESULTS_FOR_LATEST);
        return query.getResultList();
    }

    public List<Runner> getAllRunnersWithResult() {
        TypedQuery<Runner> query = em.createQuery("SELECT r FROM Runner r WHERE r.resultInMillis IS NOT NULL ORDER BY r.resultInMillis asc", Runner.class);
        return query.getResultList();
    }

    public List<Runner> getLeadingRunnersByCategory(ResultCategory category) {
        TypedQuery<Runner> query;
        if (category.getGender() != null) {
            query = em.createQuery("SELECT r FROM Runner r WHERE r.age BETWEEN :minAge AND :maxAge AND r.gender = :gender AND r.resultInMillis IS NOT NULL ORDER BY r.resultInMillis asc", Runner.class);
            query.setParameter("gender", category.getGender());
        } else {
            query = em.createQuery("SELECT r FROM Runner r WHERE r.age BETWEEN :minAge AND :maxAge AND r.resultInMillis IS NOT NULL ORDER BY r.resultInMillis asc", Runner.class);
        }
        query.setParameter("minAge", category.getMinAge());
        query.setParameter("maxAge", category.getMaxAge());
        query.setMaxResults(MAX_RESULTS_FOR_CATRGORY);
        return query.getResultList();
    }

    public List<Runner> getAllRunners() {
        TypedQuery<Runner> query = em.createQuery("SELECT r FROM Runner r ORDER BY r.runnerNumber desc", Runner.class);
        return query.getResultList();
    }

    public void createRunner(Runner runner) {
        em.persist(runner);
    }
}
