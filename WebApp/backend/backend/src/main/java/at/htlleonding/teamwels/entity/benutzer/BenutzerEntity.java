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

    @Column(name = "mail", nullable = true)
    public String mail;

    @Column(name = "tel", nullable = true)
    public String tel;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();
}