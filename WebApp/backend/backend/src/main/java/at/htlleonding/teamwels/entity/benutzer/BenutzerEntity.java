package at.htlleonding.teamwels.entity.benutzer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "benutzer")
public class BenutzerEntity extends PanacheEntity {

    @Column(name = "vorname", nullable = false)
    public String vorname;

    @Column(name = "nachname", nullable = false)
    public String nachname;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();
}