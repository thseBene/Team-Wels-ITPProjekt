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

    // NEU: Benutzer nach E-Mail finden
    @GET
    @Path("/mail/{mail}")
    public Response getByMail(@PathParam("mail") String mail) {
        BenutzerEntity benutzer = BenutzerEntity.findByMail(mail);
        if (benutzer == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Kein Benutzer mit E-Mail " + mail + " gefunden")
                    .build();
        }
        return Response.ok(benutzer).build();
    }

    // NEU: Benutzer nach Telefonnummer finden
    @GET
    @Path("/tel/{tel}")
    public Response getByTel(@PathParam("tel") String tel) {
        BenutzerEntity benutzer = BenutzerEntity.findByTel(tel);
        if (benutzer == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Kein Benutzer mit Telefonnummer " + tel + " gefunden")
                    .build();
        }
        return Response.ok(benutzer).build();
    }

    @POST
    @Transactional
    public Response create(BenutzerPayload payload) {

        BenutzerEntity benutzer = new BenutzerEntity();

        benutzer.mail = payload.mail;
        benutzer.tel = payload.tel;
        benutzer.rolle = "nutzer";

        repo.persist(benutzer);
        URI location = URI.create("/api/benutzer/" + benutzer.id);
        return Response.created(location).entity(benutzer).build();
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