package at. htlleonding.teamwels.entity.activitylog;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Instant;
import java. util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ActivityLogRepository implements PanacheRepository<ActivityLogEntity> {

    /**
     * Findet alle Logs sortiert nach Timestamp (neueste zuerst)
     */
    public List<ActivityLogEntity> findAllSorted() {
        return listAll(Sort.by("timestamp").descending());
    }

    /**
     * Findet Logs nach Feedback-ID
     */
    public List<ActivityLogEntity> findByFeedbackId(Long feedbackId) {
        return list("feedbackId", Sort.by("timestamp").descending(), feedbackId);
    }

    /**
     * Findet Logs nach Mitarbeiter-ID (GEÄNDERT)
     */
    public List<ActivityLogEntity> findByMitarbeiterId(Long mitarbeiterId) {
        return list("mitarbeiter. id", Sort.by("timestamp").descending(), mitarbeiterId);
    }

    /**
     * Findet Logs nach Action Type
     */
    public List<ActivityLogEntity> findByActionType(String actionType) {
        return list("actionType", Sort. by("timestamp").descending(), actionType);
    }

    /**
     * Findet Logs in einem Zeitraum
     */
    public List<ActivityLogEntity> findByDateRange(Instant from, Instant to) {
        return list("timestamp >= ? 1 and timestamp <= ?2",
                Sort.by("timestamp").descending(), from, to);
    }

    /**
     * Komplexe Filterung mit mehreren Parametern (GEÄNDERT)
     */
    public List<ActivityLogEntity> findByFilters(Long mitarbeiterId, Long feedbackId,
                                                 String actionType, Instant from, Instant to) {
        StringBuilder query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();

        if (mitarbeiterId != null) {
            query.append(" and mitarbeiter.id = : mitarbeiterId");
            params.put("mitarbeiterId", mitarbeiterId);
        }

        if (feedbackId != null) {
            query.append(" and feedbackId = :feedbackId");
            params.put("feedbackId", feedbackId);
        }

        if (actionType != null && !actionType.trim().isEmpty()) {
            query. append(" and actionType = :actionType");
            params.put("actionType", actionType);
        }

        if (from != null) {
            query.append(" and timestamp >= : from");
            params.put("from", from);
        }

        if (to != null) {
            query.append(" and timestamp <= :to");
            params. put("to", to);
        }

        return list(query. toString(), Sort.by("timestamp").descending(), params);
    }
}