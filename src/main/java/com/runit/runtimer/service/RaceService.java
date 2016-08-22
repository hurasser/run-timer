package com.runit.runtimer.service;

import com.runit.runtimer.dto.CategoryResultResponse;
import com.runit.runtimer.dto.ResultDto;
import com.runit.runtimer.dto.RunnerDto;
import com.runit.runtimer.model.Race;
import com.runit.runtimer.model.RaceResult;
import com.runit.runtimer.model.Runner;
import com.runit.runtimer.model.category.*;
import com.runit.runtimer.repository.RaceRepository;
import com.runit.runtimer.util.TimeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.*;
import java.nio.charset.Charset;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;

@Stateless
public class RaceService {

    private static final Logger logger = LoggerFactory.getLogger(RaceService.class);
    private static Map<Integer, ResultCategory> categoryMap = new HashMap<>();
    private static int categoryCount;

    @Inject
    private RaceRepository raceRepository;

    static {
        categoryCount = 0;
        categoryMap.put(categoryCount++, new AllRunnersCategory());
        categoryMap.put(categoryCount++, new MenCategory());
        categoryMap.put(categoryCount++, new WomenCategory());
        categoryMap.put(categoryCount++, new O55Category());
        categoryMap.put(categoryCount++, new O55MenCategory());
        categoryMap.put(categoryCount++, new O55WomenCategory());
        categoryMap.put(categoryCount++, new U6Category());
        categoryMap.put(categoryCount++, new U6MenCategory());
        categoryMap.put(categoryCount++, new U6WomenCategory());
        categoryMap.put(categoryCount++, new U9Category());
        categoryMap.put(categoryCount++, new U9MenCategory());
        categoryMap.put(categoryCount++, new U9WomenCategory());
        categoryMap.put(categoryCount++, new U12Category());
        categoryMap.put(categoryCount++, new U12MenCategory());
        categoryMap.put(categoryCount++, new U12WomenCategory());
        categoryMap.put(categoryCount++, new U15Category());
        categoryMap.put(categoryCount++, new U15MenCategory());
        categoryMap.put(categoryCount++, new U15WomenCategory());
        categoryMap.put(categoryCount++, new U18Category());
        categoryMap.put(categoryCount++, new U18MenCategory());
        categoryMap.put(categoryCount++, new U18WomenCategory());
    }

    public Race getRace() {
        return raceRepository.getRace();
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
            setRunnerResult(rr);
        }
    }

    private void setRunnerResult(RaceResult rr) {
        Runner runner = raceRepository.getRunnerByNumber(rr.getRunnerNumber());
        if (runner == null) {
            logger.error("No runner exists with number " + rr.getRunnerNumber() + ". Result not saved to any runner.");
            return;
        }
        if (runner.getResultInMillis() != null) {
            logger.warn("Adding result " + rr.getTimeInMillis() + " for runner with number " + rr.getRunnerNumber() + ". Runner already has a result " + runner.getResultInMillis());
        }
        runner.setResultInMillis(rr.getTimeInMillis());
    }

    private void removeResultFromRunner(int runnerNumber) {
        Runner runner = raceRepository.getRunnerByNumber(runnerNumber);
        if (runner != null) {
            runner.setResultInMillis(null);
        }
    }

    public List<ResultDto> getLatestResults(int numberOfResults) {
        List<Runner> latestRunners = raceRepository.getLatestRunners(numberOfResults);
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
        return runners.stream().map(RunnerDto::new).collect(Collectors.toList());
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

    public List<ResultDto> getResultsForRunnerNumber(int runnerNumber) {
        List<RaceResult> results = raceRepository.getResultsForRunnerNumber(runnerNumber);
        if (results.size() == 0) {
            return new ArrayList<>();
        }
        Runner runner = raceRepository.getRunnerByNumber(runnerNumber);
        return results.stream().map(r -> new ResultDto(runnerNumber, r.getTimeInMillis(), runner.getFirstName() + " " + runner.getLastName(), r.getId())).collect(Collectors.toList());
    }

    public ResultDto editResult(ResultDto dto) {
        RaceResult result = raceRepository.getResultById(dto.id);
        if (result == null) return null;
        logger.info(String.format("Editing result id %d; time %d; number %d", dto.id, dto.time, dto.number));
        result.setTimeInMillis(dto.time);
        if (result.getRunnerNumber() != dto.number) {
            int oldRunnerNumber = result.getRunnerNumber();
            result.setRunnerNumber(dto.number);
            // Update result on old runner
            List<RaceResult> results = raceRepository.getResultsForRunnerNumber(oldRunnerNumber);
            RaceResult oldResult = results.stream()
                    .filter(r -> r.getId() != dto.id)
//                    .sorted((r1, r2) -> Integer.compare(r2.getTimeInMillis(), r1.getTimeInMillis()))
                    .sorted(comparing(RaceResult::getTimeInMillis).reversed())
                    .findFirst()
                    .orElse(null);
            if (oldResult != null) {
                setRunnerResult(oldResult);
            } else {
                removeResultFromRunner(oldRunnerNumber);
            }
        }
        // Set result on new or old runner
        setRunnerResult(result);
        return new ResultDto(dto.number, dto.time, raceRepository.getRunnerByNumber(dto.number).fullName(), dto.id);
    }

    public void deleteResult(int resultId) {
        RaceResult result = raceRepository.getResultById(resultId);
        if (result != null) {
            Runner runner = raceRepository.getRunnerByNumber(result.getRunnerNumber());
            if (runner != null && runner.getResultInMillis() == result.getTimeInMillis()) {
                List<RaceResult> results = raceRepository.getResultsForRunnerNumber(result.getRunnerNumber());
                RaceResult oldResult = results.stream()
                        .filter(r -> r.getId() != result.getId())
                        .sorted(comparing(RaceResult::getTimeInMillis).reversed())
                        .findFirst()
                        .orElse(null);
                if (oldResult != null) {
                    runner.setResultInMillis(oldResult.getTimeInMillis());
                } else {
                    runner.setResultInMillis(null);
                }
            }
            raceRepository.deleteResult(result);
        }
    }

    public List<RunnerDto> getRunnersWithMultipleResults() {
        List<Integer> runnerNumbers = raceRepository.getRunnerNumbersWithMultipleResults();
        if (runnerNumbers.size() == 0) return new ArrayList<>();
        List<Runner> runners = raceRepository.getRunnersWithNumbers(runnerNumbers);
        return runners.stream().map(RunnerDto::new).collect(Collectors.toList());
    }

    public List<RunnerDto> getRunnersWithNoResult() {
        List<Runner> runners = raceRepository.getRunnersWithNoResult();
        if (runners.size() == 0) return new ArrayList<>();
        return runners.stream().map(RunnerDto::new).collect(Collectors.toList());
    }

    public void printResults() {
        for (int i = 0; i < categoryMap.size(); i++) {
            ResultCategory category = categoryMap.get(i);
            List <Runner> runners = raceRepository.getResultsByCategory(category);
            try {
                writeResultFiles(category, runners);
            } catch (IOException e) {
                logger.error("Unable to write results file for category: " + category.getCategoryId());
            }
        }
    }

    public void printDNF() {
        try {
            List<Runner> runners = raceRepository.getRunnersWithNoResult();
            String fileNameTxt = "/Users/rasmus/results/UdenResultat.txt";
            String fileNameCsv = "/Users/rasmus/results/UdenResultat.csv";
            File txtFile = new File(fileNameTxt);
            File csvFile = new File(fileNameCsv);
            FileOutputStream fosTxt = new FileOutputStream(txtFile);
            FileOutputStream fosCsv = new FileOutputStream(csvFile);
            BufferedWriter bwTxt = new BufferedWriter(new OutputStreamWriter(fosTxt, Charset.forName("UTF-8").newEncoder()));
            BufferedWriter bwCsv = new BufferedWriter(new OutputStreamWriter(fosCsv, Charset.forName("UTF-8").newEncoder()));
            bwTxt.write("Løberen uden resultat");
            bwTxt.newLine();
            bwCsv.write("Løber nummer;Navn;");
            bwCsv.newLine();
            for (Runner runner : runners) {
                bwTxt.write(String.format("%d %s", runner.getRunnerNumber(), runner.fullName()));
                bwTxt.newLine();
                    bwCsv.write(String.format("%d;%s;", runner.getRunnerNumber(), runner.fullName()));
                bwCsv.newLine();
            }
            bwTxt.close();
            bwCsv.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void writeResultFiles(ResultCategory category, List<Runner> runners) throws IOException {
        String fileNameTxt = "/Users/rasmus/results/" + category.getCategoryId() + ".txt";
        String fileNameCsv = "/Users/rasmus/results/" + category.getCategoryId() + ".csv";
        File txtFile = new File(fileNameTxt);
        File csvFile = new File(fileNameCsv);
        FileOutputStream fosTxt = new FileOutputStream(txtFile);
        FileOutputStream fosCsv = new FileOutputStream(csvFile);
        BufferedWriter bwTxt = new BufferedWriter(new OutputStreamWriter(fosTxt, Charset.forName("UTF-8").newEncoder()));
        BufferedWriter bwCsv = new BufferedWriter(new OutputStreamWriter(fosCsv, Charset.forName("WINDOWS-1252").newEncoder()));
        int place = 1;
        bwTxt.write(category.getTitle());
        bwTxt.newLine();
        bwCsv.write("Placering;Løber nummer;Navn;Tid;");
        bwCsv.newLine();
        for (Runner runner : runners) {
            bwTxt.write(String.format("%d %s %s", place, runner.fullName(), TimeUtil.formatTimeInMillis(runner.getResultInMillis())));
            bwTxt.newLine();
            bwCsv.write(String.format("%d;%d;%s;%s;", place, runner.getRunnerNumber(), runner.fullName(), TimeUtil.formatTimeInMillis(runner.getResultInMillis())));
            bwCsv.newLine();
            place++;
        }
        bwTxt.close();
        bwCsv.close();
    }
}
