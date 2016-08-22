package com.runit.runtimer.resource;

import com.runit.runtimer.dto.RaceDto;
import com.runit.runtimer.dto.CategoryResultResponse;
import com.runit.runtimer.dto.ResultDto;
import com.runit.runtimer.dto.RunnerDto;
import com.runit.runtimer.model.Race;
import com.runit.runtimer.service.RaceService;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/race")
@Produces(MediaType.APPLICATION_JSON)
public class RaceResource {

    @Inject
    private RaceService raceService;

    @GET
    @Path("/start")
    public Response getStartTime() {
        Race race = raceService.getRace();
        if (race != null) return Response.ok(new RaceDto(race)).build();
        return Response.noContent().build();
    }

    @POST
    @Path("/start")
    public Response startRace() {
        raceService.startRace();
        return Response.noContent().build();
    }

    @GET
    @Path("/results")
    public Response getLatestResults(@QueryParam("numberOfResults") int numberOfResults) {
        List<ResultDto> results = raceService.getLatestResults(numberOfResults);
        return Response.ok(results).build();
    }

    @GET
    @Path("/resultList")
    public Response getResultList() {
        List<ResultDto> results = raceService.getAllResults();
        return Response.ok(results).build();
    }

    @POST
    @Path("/results")
    public Response saveResults(List<ResultDto> results) {
        raceService.saveResults(results);
        return Response.noContent().build();
    }

    @GET
    @Path("/categoryResults/{startIndex}")
    public Response getCategoryResults(@PathParam("startIndex") int startIndex) {
        List<CategoryResultResponse> results = raceService.getCategoryResults(startIndex);
        return Response.ok(results).build();
    }

    @GET
    @Path("/runners")
    public Response getRunners() {
        List<RunnerDto> runners = raceService.getAllRunners();
        return Response.ok(runners).build();
    }

    @POST
    @Path("/runner")
    public Response createRunner(RunnerDto dto) {
        RunnerDto createdDto = raceService.createRunner(dto);
        return Response.ok(createdDto).build();
    }

    @PUT
    @Path("/runner/{runnerId}")
    public Response updateRunner(RunnerDto dto) {
        raceService.updateRunner(dto);
        return Response.ok().build();
    }

    @GET
    @Path("/runnerResults")
    public Response getResultsForRunner(@QueryParam("runnerNumber") int runnerNumber) {
//        if (runnerNumber == 42) {
//            raceService.printResults();
//            raceService.printDNF();
//        }
        List<ResultDto> results = raceService.getResultsForRunnerNumber(runnerNumber);
        return Response.ok(results).build();
    }

    @POST
    @Path("/editResult")
    public Response editResult(ResultDto dto) {
        ResultDto editedDto = raceService.editResult(dto);
        return Response.ok(editedDto).build();
    }

    @DELETE
    @Path("/result/{resultId}")
    public Response deleteResult(@PathParam("resultId") int resultId) {
        raceService.deleteResult(resultId);
        return Response.ok().build();
    }

    @GET
    @Path("/runner/multipleResults")
    public Response getRunnersWithMultipleResults() {
        List<RunnerDto> runners = raceService.getRunnersWithMultipleResults();
        return Response.ok(runners).build();
    }

    @GET
    @Path("/runner/noResult")
    public Response getRunnersWithNoResult() {
        List<RunnerDto> runners = raceService.getRunnersWithNoResult();
        return Response.ok(runners).build();
    }
}
