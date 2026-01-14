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
        if ((payload.mail == null || payload.mail.trim().isEmpty()) && (payload.tel == null || payload.tel.trim().isEmpty())) {
            return Response.status(Response.Status.BAD_REQUEST).entity("mail oder tel muss gesetzt sein").build();
        }

        String normalizedMail = payload.mail != null ? BenutzerEntity.normalizeMail(payload.mail) : null;
        String normalizedTel = payload.tel != null ? BenutzerEntity.normalizeTel(payload.tel) : null;

        // Prüfen ob Benutzer mit Mail existiert
        if (normalizedMail != null && !normalizedMail.isEmpty()) {
            BenutzerEntity existing = BenutzerEntity.findByMail(normalizedMail);
            if (existing != null) {
                // Return existing user (200 OK) — Frontend kann so immer den Benutzer-Objekt nutzen
                return Response.ok(existing).build();
            }
        }

        // Prüfen ob Benutzer mit Tel existiert
        if (normalizedTel != null && !normalizedTel.isEmpty()) {
            BenutzerEntity existing = BenutzerEntity.findByTel(normalizedTel);
            if (existing != null) {
                return Response.ok(existing).build();
            }
        }

        // Anlegen, dabei normalisierte Werte setzen
        BenutzerEntity benutzer = new BenutzerEntity();
        benutzer.mail = normalizedMail;
        benutzer.tel = normalizedTel;
        benutzer.rolle = "nutzer";

        repo.persist(benutzer);
        URI location = URI.create("/api/benutzer/" + benutzer.id);
        return Response.created(location).entity(benutzer).build();
    }

    @PUT
    @Transactional
    @Path("{id}")
    public Response update(@PathParam("id") Long id, BenutzerEntity entity){
        BenutzerEntity existing = repo.findById(id);
        if (existing == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Benutzer nicht gefunden").build();
        }

        // Normalisiere neue Werte
        String newMail = entity.mail != null ? BenutzerEntity.normalizeMail(entity.mail) : null;
        String newTel = entity.tel != null ? BenutzerEntity.normalizeTel(entity.tel) : null;

        // Prüfen Konflikte: Mail
        if (newMail != null && !newMail.isEmpty()) {
            BenutzerEntity byMail = BenutzerEntity.findByMail(newMail);
            if (byMail != null && !byMail.id.equals(id)) {
                return Response.status(Response.Status.CONFLICT).entity("E-Mail wird bereits von anderem Benutzer verwendet").build();
            }
        }

        // Prüfen Konflikte: Tel
        if (newTel != null && !newTel.isEmpty()) {
            BenutzerEntity byTel = BenutzerEntity.findByTel(newTel);
            if (byTel != null && !byTel.id.equals(id)) {
                return Response.status(Response.Status.CONFLICT).entity("Telefonnummer wird bereits von anderem Benutzer verwendet").build();
            }
        }

        existing.mail = newMail;
        existing.tel = newTel;

        return Response.ok(existing).build();
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