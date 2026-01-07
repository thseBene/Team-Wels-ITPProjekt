package at.htlleonding. teamwels.entity.mitarbeiter;

import at.htlleonding.teamwels.entity.benutzer. BenutzerEntity;  // ← Import hinzufügen!
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name="mitarbeiter")
public class MitarbeiterEntity extends PanacheEntityBase {

    @Id  // Kein @GeneratedValue!
    public Long id;

    // 1:1 Beziehung zu BenutzerEntity
    @OneToOne
    @MapsId
    @JoinColumn()
    public BenutzerEntity benutzer;

    @Column(nullable = false, unique = true)
    public String benutzername;

    @Column( nullable = false)
    public String passwort;

    @Column( nullable = false)
    public String vorname;

    @Column(nullable = false)
    public String nachname;

    @Column()
    public String abteilung;

    @Column(nullable = false)
    public Boolean aktiv = true;

    @Column()
    public Instant letzterLogin;

    // Hilfsmethode für Login
    public static MitarbeiterEntity findByBenutzername(String benutzername) {
        return find("benutzername = ? 1 and aktiv = true", benutzername)  // ← Leerzeichen entfernt!
                .firstResult();
    }
}