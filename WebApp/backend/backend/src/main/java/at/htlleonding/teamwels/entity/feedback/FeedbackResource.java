package at.htlleonding.teamwels.entity.feedback;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.benutzer.BenutzerRepository;
import at.htlleonding.teamwels.entity.kategorie.KategorieEntity;
import at.htlleonding.teamwels.entity.kategorie.KategorieRepository;
import at.htlleonding.teamwels.entity.status.StatusEntity;
import at.htlleonding.teamwels.entity.status.StatusRepository;
import at.htlleonding.teamwels.entity.thema.ThemaEntity;
import at.htlleonding.teamwels.entity.thema.ThemaRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Path("/api/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedbackResource {

    @Inject
    FeedbackRepository repo;

    @Inject
    BenutzerRepository benutzerRepo;

    @Inject
    ThemaRepository themaRepo;

    @Inject
    StatusRepository statusRepo;

    @Inject
    KategorieRepository kategorieRepo;


    @GET
    public List<FeedbackEntity> list() {
        return repo.listAll();
    }

    @GET
    @Path("{id}")
    public FeedbackEntity get(@PathParam("id") Long id) {
        FeedbackEntity f = repo.findById(id);
        if (f == null) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        return f;
    }

    /**
     * Erwartet ein JSON-Objekt mit einfachen Feldern und ID-Referenzen.
     * Beispiel:
     * {
     *   "subject":"Betreff",
     *   "description":"Beschreibung",
     *   "type":"Lob",
     *   "statusId": 1,
     *   "userId": 2,
     *   "themaId": 3,
     *   "kategorieIds": [1,2],
     *   "bilder": [{"bildpfad":"pfad","beschreibung":"text"}]
     * }
     */
    @POST
    @Transactional
    public Response create(FeedbackPayload payload) {
        FeedbackEntity f = new FeedbackEntity();
        applyPayloadToEntity(payload, f, true);

        repo.persist(f);
        return Response.created(URI.create("/api/feedback/" + f.id)).build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public FeedbackEntity update(@PathParam("id") Long id, FeedbackPayload payload) {
        FeedbackEntity existing = repo.findById(id);
        if (existing == null) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        applyPayloadToEntity(payload, existing, false);
        existing.updatedAt = Instant.now();
        return existing;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = repo.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        return Response.noContent().build();
    }

    // Hilfsmethode: füllt die Entity aus dem Payload, optional neue Bilder/Kategorien anlegen
    private void applyPayloadToEntity(FeedbackPayload payload, FeedbackEntity f, boolean isNew) {
        if (payload == null) {
            throw new BadRequestException("Payload leer");
        }
        if (payload.subject != null) f.subject = payload.subject;
        if (payload.description != null) f.description = payload.description;
        if (payload.type != null) f.type = payload.type;

        // Status
        if (payload.statusId != null) {
            StatusEntity s = statusRepo.findById(payload.statusId);
            if (s == null) throw new NotFoundException("Status mit id " + payload.statusId + " nicht gefunden");
            f.status = s;
        } else {
            f.status = null;
        }

        // User
        if (payload.userId != null) {
            BenutzerEntity u = benutzerRepo.findById(payload.userId);
            if (u == null) throw new NotFoundException("Benutzer mit id " + payload.userId + " nicht gefunden");
            f.user = u;
        } else {
            f.user = null;
        }

        // Thema
        if (payload.themaId != null) {
            ThemaEntity t = themaRepo.findById(payload.themaId);
            if (t == null) throw new NotFoundException("Thema mit id " + payload.themaId + " nicht gefunden");
            f.thema = t;
        } else {
            f.thema = null;
        }

        // Kategorien (ManyToMany) - ersetze die bisherigen Kategorien durch die angegebenen
        if (payload.kategorieIds != null) {
            f.kategorien.clear();
            for (Long kid : payload.kategorieIds) {
                KategorieEntity k = kategorieRepo.findById(kid);
                if (k == null) throw new NotFoundException("Kategorie mit id " + kid + " nicht gefunden");
                f.kategorien.add(k);
            }
        }

        // Bilder (OneToMany) - wenn bilder übergeben werden, ersetzen wir die vorhandenen

        // createdAt/updatedAt
        Instant now = Instant.now();
        if (isNew) {
            if (f.createdAt == null) f.createdAt = now;
            if (f.updatedAt == null) f.updatedAt = now;
        } else {
            f.updatedAt = now;
        }
    }

    // DTO-Klassen für das API-Contract
    public static class FeedbackPayload {
        public String subject;
        public String description;
        public String type;
        public Long statusId;
        public Long userId;
        public Long themaId;
        public List<Long> kategorieIds = new ArrayList<>();
        public List<BildPayload> bilder = new ArrayList<>();
    }

    public static class BildPayload {
        public String bildpfad;
        public String beschreibung;
    }
}