    async function getAllFeedback() {
        console.log("Fetching all feedback...");
        const response = await fetch("http://localhost:8080/api/feedback", {
            method: "GET",
            headers: {
            "Accept": "application/json"
            }
        });

        console.log('Response:', response);
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen: ${response.status}`);
        }

        const feedbackList = await response.json();
        console.log("Feedbacks:", feedbackList);
        let html = '';
        for (const feedback of feedbackList) {
                html += `
                <div class="feedbackItem">`;
            
                html += `<h3>${feedback.subject}</h3>`;
                
                if(feedback.status != null) {
                    html += `<p>Status: ${feedback.status}</p>`;

                    if (feedback.status == "Neu") {
                        html += `<div class="editStatus" onclick="updateByID(${feedback.id}, 'In Bearbeitung')">
                            Jetzt bearbeiten
                        </div>`;
                    }
                    else if(feedback.status == "In Bearbeitung") {
                        html += `<div class="editStatus" onclick="updateByID(${feedback.id}, 'Erledigt')">
                            Jetzt fertigstellen
                        </div>`;
                    }
                        

                }
                html += `
                </div>
                `;
        }
        document.getElementById('container')!.innerHTML = html;
    }

    
async function updateByID(id: number, newStatus: string) {
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

}



getAllFeedback();


async function fetchByID(id: number) {
    const response = await fetch(`http://localhost:8080/api/feedback/${id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen: ${response.status}`);
  }
  const feedback = await response.json();
  console.log('FetchById', feedback);
}
        


function deleteByID(id: number) {
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
