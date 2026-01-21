package at.htlleonding.teamwels.entity.benutzer;

import at.htlleonding.teamwels.entity.feedback.services.SmsService;
import at.htlleonding.teamwels.entity.feedback.services.EmailService;
import io.vertx.core.http.HttpServerRequest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Path("/api/benutzer")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BenutzerResource {
    @Inject
    BenutzerRepository repo;

    @Inject
    RateLimitService rateLimitService;

    @Context
    HttpServerRequest httpRequest;

    @Inject
    EmailService emailService;

    @Inject
    SmsService smsService;

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

        String clientIp = getClientIp();

        if (rateLimitService.isRateLimited(clientIp, 3, Duration.ofHours(1))){
            return Response.status(Response.Status.TOO_MANY_REQUESTS)
                    .entity(Map.of(
                            "error", "Zu viele Registrierungsversuche",
                            "message", "Bitte versuche es später erneut",
                            "retryAfter", 3600
                    )).header("Retry-After", 3600).build();
        }

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

        // Neuen Benutzer erstellen (UNVERIFIED)
        BenutzerEntity benutzer = new BenutzerEntity();
        benutzer.mail = normalizedMail;
        benutzer.tel = normalizedTel;
        benutzer.rolle = "nutzer";
        benutzer. emailVerified = false;
        benutzer.telVerified = false;

        repo.persist(benutzer);

        // Verifizierungs-Nachrichten senden
        boolean emailSent = false;
        boolean smsSent = false;

        // E-Mail-Verifizierung
        if (benutzer.mail != null && !benutzer. mail.isEmpty()) {
            benutzer.generateEmailVerificationToken();
            try {
                emailService.sendVerificationEmail(benutzer.mail, benutzer.emailVerificationToken);
                emailSent = true;
            } catch (Exception e) {
                System.err.println("Fehler beim E-Mail-Versand: " + e.getMessage());
            }
        }

        // SMS-Verifizierung
        if (benutzer.tel != null && !benutzer.tel. isEmpty()) {
            String code = SmsService.generateVerificationCode();
            benutzer.generateTelVerificationCode(code);
            try {
                smsService.sendVerificationSms(benutzer.tel, code);
                smsSent = true;
            } catch (Exception e) {
                System.err.println("Fehler beim SMS-Versand: " + e.getMessage());
            }
        }

        return Response.status(Response.Status.CREATED)
                .entity(Map.of(
                        "message", "Benutzer erstellt.  Bitte verifizieren Sie Ihre Kontaktdaten.",
                        "id", benutzer.id,
                        "emailSent", emailSent,
                        "smsSent", smsSent,
                        "verified", false
                )).build();
    }

    // E-Mail verifizieren (wie vorher)
    @POST
    @Path("/verify-email")
    @Transactional
    public Response verifyEmail(@QueryParam("token") String token) {
        if (token == null || token.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Token fehlt").build();
        }

        BenutzerEntity user = BenutzerEntity.find("emailVerificationToken", token).firstResult();

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Ungültiger Verifizierungs-Token").build();
        }

        if (!user.isEmailVerificationTokenValid()) {
            return Response.status(Response.Status. GONE)
                    .entity("Verifizierungs-Token ist abgelaufen").build();
        }

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationTokenCreatedAt = null;

        return Response.ok()
                .entity(Map.of(
                        "message", "E-Mail erfolgreich verifiziert! ",
                        "verified", true,
                        "fullyVerified", user.isFullyVerified()
                )).build();
    }

    // NEU: SMS-Code verifizieren
    @POST
    @Path("/verify-tel")
    @Transactional
    public Response verifyTel(@QueryParam("tel") String tel, @QueryParam("code") String code) {
        if (tel == null || tel. isEmpty() || code == null || code.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Telefonnummer und Code erforderlich").build();
        }

        BenutzerEntity user = BenutzerEntity.findByTel(tel);

        if (user == null) {
            return Response. status(Response.Status.NOT_FOUND)
                    .entity("Benutzer nicht gefunden").build();
        }

        if (user.telVerified) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Telefonnummer bereits verifiziert").build();
        }

        if (!user.isTelVerificationCodeValid()) {
            return Response.status(Response.Status.GONE)
                    .entity("Verifizierungscode ist abgelaufen").build();
        }

        if (! code.equals(user.telVerificationCode)) {
            return Response.status(Response.Status. UNAUTHORIZED)
                    .entity("Ungültiger Verifizierungscode").build();
        }

        user.telVerified = true;
        user.telVerificationCode = null;
        user. telVerificationCodeCreatedAt = null;

        return Response.ok()
                .entity(Map. of(
                        "message", "Telefonnummer erfolgreich verifiziert!",
                        "verified", true,
                        "fullyVerified", user.isFullyVerified()
                )).build();
    }

    // NEU: SMS erneut senden
    @POST
    @Path("/resend-sms-verification")
    @Transactional
    public Response resendSmsVerification(@QueryParam("tel") String tel) {
        if (tel == null || tel.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Telefonnummer fehlt").build();
        }

        BenutzerEntity user = BenutzerEntity.findByTel(tel);

        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Benutzer nicht gefunden").build();
        }

        if (user.telVerified) {
            return Response.status(Response. Status.BAD_REQUEST)
                    .entity("Telefonnummer bereits verifiziert").build();
        }

        String code = SmsService.generateVerificationCode();
        user.generateTelVerificationCode(code);

        try {
            smsService.sendVerificationSms(user.tel, code);
            return Response.ok()
                    .entity(Map.of("message", "Verifizierungscode wurde erneut gesendet"))
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status. INTERNAL_SERVER_ERROR)
                    .entity("Fehler beim SMS-Versand: " + e.getMessage())
                    .build();
        }
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
    //Hilfsmethoden
    private String getClientIp() {
        // Zuerst X-Forwarded-For Header prüfen (für Proxies/Load Balancer)
        String xForwardedFor = httpRequest.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Nimm die erste IP (Original-Client)
            return xForwardedFor.split(",")[0].trim();
        }

        // Sonst direkte Remote Address
        return httpRequest.remoteAddress().hostAddress();
    }
}