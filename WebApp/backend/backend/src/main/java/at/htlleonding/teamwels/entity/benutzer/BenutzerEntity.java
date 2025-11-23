package at.htlleonding.teamwels.entity.benutzer;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "benutzer")
public class BenutzerEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "mail", unique = true)  // ← UNIQUE hinzugefügt
    public String mail;

    @Column(name = "tel", unique = true)   // ← UNIQUE hinzugefügt
    public String tel;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();

    // Hilfsmethode für Abfragen
    public static BenutzerEntity findByMail(String mail) {
        return find("mail", mail).firstResult();
    }

    public static BenutzerEntity findByTel(String tel) {
        return find("tel", tel).firstResult();
    }
}