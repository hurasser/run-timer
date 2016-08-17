package com.runit.runtimer.service;

import com.runit.runtimer.dto.CategoryResultResponse;
import com.runit.runtimer.dto.ResultDto;
import com.runit.runtimer.dto.RunnerDto;
import com.runit.runtimer.model.Race;
import com.runit.runtimer.model.RaceResult;
import com.runit.runtimer.model.Runner;
import com.runit.runtimer.model.category.*;
import com.runit.runtimer.repository.RaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.*;
import java.util.stream.Collectors;

@Stateless
public class RaceService {

    private static final Logger logger = LoggerFactory.getLogger(RaceService.class);
    private static Map<Integer, ResultCategory> categoryMap = new HashMap<>();
    private static int categoryCount;

    @Inject
    private RaceRepository raceRepository;

    static {
        categoryCount = 0;
        categoryMap.put(categoryCount++, new MenCategory());
        categoryMap.put(categoryCount++, new WomenCategory());
        categoryMap.put(categoryCount++, new O55MenCategory());
        categoryMap.put(categoryCount++, new O55WomenCategory());
        categoryMap.put(categoryCount++, new U6Category());
        categoryMap.put(categoryCount++, new U9Category());
        categoryMap.put(categoryCount++, new U12Category());
        categoryMap.put(categoryCount++, new U15Category());
        categoryMap.put(categoryCount++, new U18Category());
    }

    public Race getActiveRace() {
        List<Race> races = raceRepository.getActiveRaces();
        if (races.size() != 1) return null;
        return races.get(0);
    }

    public void startRace() {
        logger.info("Starting new race at " + new Date().toString());
        Race race = raceRepository.getRace();
        if (race.getStartTime() != null) {
            logger.error("Cannot start race - race is already started");
            return;
        }
        race.setStartTime(new Date());
    }

    public void saveResults(List<ResultDto> resultDtos) {
        List<RaceResult> results = resultDtos.stream().map(r -> new RaceResult(r.number, r.time)).collect(Collectors.toList());
        raceRepository.saveResults(results);
        for (RaceResult rr : results) {
            Runner runner = raceRepository.getRunnerByNumber(rr.getRunnerNumber());
            if (runner == null) {
                logger.error("No runner exists with number " + rr.getRunnerNumber() + ". Result not saved to any runner.");
                continue;
            }
            if (runner.getResultInMillis() != null) {
                logger.warn("Adding result " + rr.getTimeInMillis() + " for runner with number " + rr.getRunnerNumber() + ". Runner already has a result " + runner.getResultInMillis());
            }
            runner.setResultInMillis(rr.getTimeInMillis());
        }
    }

    public List<ResultDto> getLatestResults() {
        List<Runner> latestRunners = raceRepository.getLatestRunners();
        List<ResultDto> resultDtos = getResultDtos(latestRunners);
        return resultDtos;
    }

    public List<ResultDto> getAllResults() {
        List<Runner> allRunnersWithResult = raceRepository.getAllRunnersWithResult();
        return getResultDtos(allRunnersWithResult);
    }

    public List<CategoryResultResponse> getCategoryResults(int categoryStartIndex) {
        int tries = 0;
        int results = 0;
        List<CategoryResultResponse> response = new ArrayList<>();
        while (tries < categoryCount && results < 2) {
            if (categoryStartIndex >= categoryCount) categoryStartIndex = categoryStartIndex % categoryCount;
            ResultCategory firstCategory = categoryMap.get(categoryStartIndex);
            List<Runner> leadingRunnersByCategory = raceRepository.getLeadingRunnersByCategory(firstCategory);
            if (leadingRunnersByCategory.size() > 0) {
                response.add(new CategoryResultResponse(firstCategory.getTitle(), categoryStartIndex, getResultDtos(leadingRunnersByCategory)));
                results++;
            }
            tries++;
            categoryStartIndex++;
        }
        return response;
    }

    private List<ResultDto> getResultDtos(List<Runner> runners) {
        List<ResultDto> resultDtos = new ArrayList<>();
        for (Runner r : runners) {
            ResultDto dto = new ResultDto();
            dto.number = r.getRunnerNumber();
            dto.time = r.getResultInMillis();
            dto.name = r.getFirstName() + " " + r.getLastName();
            resultDtos.add(dto);
        }
        return resultDtos;
    }

    public List<RunnerDto> getAllRunners() {
        List<Runner> runners = raceRepository.getAllRunners();
        return runners.stream().map(r -> new RunnerDto(r)).collect(Collectors.toList());
    }

    public RunnerDto createRunner(RunnerDto dto) {
        Runner runner = new Runner();
        runner.setRunnerNumber(dto.number);
        runner.setFirstName(dto.firstName);
        runner.setLastName(dto.lastName);
        runner.setAge(dto.age);
        runner.setGender(dto.gender);
        raceRepository.createRunner(runner);
        return new RunnerDto(runner);
    }

    public void updateRunner(RunnerDto dto) {
        Runner runner = raceRepository.getRunnerById(dto.id);
        if (runner != null) {
            runner.setRunnerNumber(dto.number);
            runner.setFirstName(dto.firstName);
            runner.setLastName(dto.lastName);
            runner.setAge(dto.age);
            runner.setGender(dto.gender);
        }
    }
}
