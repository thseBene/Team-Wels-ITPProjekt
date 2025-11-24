"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getAllFeedback() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching all feedback...");
        const response = yield fetch("http://localhost:8080/api/feedback", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen: ${response.status}`);
        }
        const feedbackList = yield response.json();
        console.log("Feedbacks:", feedbackList);
        let html = '';
        for (const feedback of feedbackList) {
            html += `
                <div class="feedbackItem">`;
            html += `<h3>${feedback.subject}</h3>`;
            if (feedback.status != null) {
                html += `<p>Status: ${feedback.status}</p>`;
                if (feedback.status == "Neu") {
                    html += `<div class="editStatus" onclick="updateByID(${feedback.id}, 'In Bearbeitung')">
                            Jetzt bearbeiten
                        </div>`;
                }
                else if (feedback.status == "In Bearbeitung") {
                    html += `<div class="editStatus" onclick="updateByID(${feedback.id}, 'Erledigt')">
                            Jetzt fertigstellen
                        </div>`;
                }
            }
            html += `
                </div>
                `;
        }
        document.getElementById('container').innerHTML = html;
    });
}
function updateByID(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedFeedback = {
            status: newStatus
        };
        fetch(`http://localhost:8080/api/feedback/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedFeedback)
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`Fehler beim Aktualisieren: ${response.status}`);
            }
            console.log(`Feedback mit ID ${id} aktualisiert.`);
            getAllFeedback(); // Refresh the feedback list after update
        })
            .catch(error => {
            console.error('Fehler:', error);
        });
    });
}
getAllFeedback();
function fetchByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:8080/api/feedback/${id}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen: ${response.status}`);
        }
        const feedback = yield response.json();
        console.log('FetchById', feedback);
    });
}
function deleteByID(id) {
    fetch(`http://localhost:8080/api/feedback/${id}`, {
        method: "DELETE"
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`Fehler beim Löschen: ${response.status}`);
        }
        console.log(`Feedback mit ID ${id} gelöscht.`);
    })
        .catch(error => {
        console.error('Fehler:', error);
    });
}
