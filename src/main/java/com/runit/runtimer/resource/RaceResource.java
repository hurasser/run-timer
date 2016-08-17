package com.runit.runtimer.resource;

import com.runit.runtimer.dto.ActiveRaceDto;
import com.runit.runtimer.dto.CategoryResultResponse;
import com.runit.runtimer.dto.ResultDto;
import com.runit.runtimer.dto.RunnerDto;
import com.runit.runtimer.model.Race;
import com.runit.runtimer.model.Runner;
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
        Race race = raceService.getActiveRace();
        if (race != null) return Response.ok(new ActiveRaceDto(race.getStartTime().getTime())).build();
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
    public Response getLatestResults() {
        List<ResultDto> results = raceService.getLatestResults();
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
}
