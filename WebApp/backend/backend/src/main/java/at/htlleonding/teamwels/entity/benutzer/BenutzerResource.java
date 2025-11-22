package at.htlleonding.teamwels.entity.benutzer;


import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


import java.net.URI;
import java.util.List;


@Path("/api/benutzer")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BenutzerResource {
    @Inject
    BenutzerRepository repo;


    @GET
    public List<BenutzerEntity> getAllUser(){
        return repo.listAll();
    }

    @POST
    @Transactional
    public Response create(BenutzerPayload payload) {

        BenutzerEntity benutzer = new BenutzerEntity();

        benutzer.mail = payload.mail;
        benutzer.tel = payload.tel;
        benutzer.rolle = "nutzer";

        repo.persist(benutzer);
        return Response.created(URI.create("/api/benutzer" + benutzer.id)).build();
    }
    @PUT
    @Transactional
    @Path("{id}")
    public BenutzerEntity update(@PathParam("id") Long id, BenutzerEntity entity){
        BenutzerEntity existing = repo.findById(id);
        existing.mail = entity.mail;
        existing.tel = entity.tel;

        return existing;
    }

    @DELETE
    @Transactional
    public Response delete(BenutzerEntity entity) {
        repo.delete(entity);
        return Response.noContent().build();
    }
    public static class BenutzerPayload{
        public String mail;
        public String tel;
    }
}
