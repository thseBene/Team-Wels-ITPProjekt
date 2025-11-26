package at.htlleonding.teamwels.entity.feedback;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Feste Statuswerte für Feedback.
 * Wir speichern die Enum als STRING in der DB (lesbar) und unterstützen sowohl den Enum-Namen
 * als auch das Label beim Parsen (z. B. "IN_BEARBEITUNG" oder "In Bearbeitung").
 */
public enum Status {
    NEU("Neu"),
    IN_BEARBEITUNG("In Bearbeitung"),
    ERLEDIGT("Erledigt");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }

    @JsonCreator
    public static Status from(String value) {
        if (value == null) return null;
        // akzeptiere sowohl Enum-Name als auch Label (case-insensitive)
        try {
            return Status.valueOf(value.trim().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            // versuche Label-Vergleich
            for (Status s : values()) {
                if (s.label.equalsIgnoreCase(value.trim())) {
                    return s;
                }
            }
            throw new IllegalArgumentException("Unbekannter Status: " + value);
        }
    }
}