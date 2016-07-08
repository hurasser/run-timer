package com.runit.runtimer.resource;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/race")
@Produces(MediaType.APPLICATION_JSON)
public class RaceResource {

    @GET
    @Path("/active")
    public Response getActiveRace() {
        return Response.noContent().build();
    }

    @POST
    @Path("/start")
    public Response startRace() {
        return Response.noContent().build();
    }

}
