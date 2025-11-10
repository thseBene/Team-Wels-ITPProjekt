package at.htlleonding.teamwels.entity.kategorie;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "kategorie")
public class KategorieEntity extends PanacheEntity {

    @Column(name = "bezeichnung", nullable = false)
    public String bezeichnung;

    @ManyToMany(mappedBy = "kategorien")
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();
}