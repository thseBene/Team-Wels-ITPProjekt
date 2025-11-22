    async function getAllFeedback() {
        const response = await fetch("http://localhost:8080/api/feedback", {
            method: "GET",
            headers: {
            "Accept": "application/json"
            }
        });

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
                    html += `<p>Status: ${feedback.status.bezeichnung}</p>`;
                }
                html += `
                    <div class="editButton">Bearbeiten</div>
                </div>
                `;
        }
        document.getElementById('container')!.innerHTML = html;
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

function updateByID(id: number, newMessage: string) {
    const updatedFeedback = {
        author: "Anonym",
        message: newMessage
    };

    fetch(`http://localhost:8080/api/feedback/${id}`, {
        method: "PUT",
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
    })
    .catch(error => {
        console.error('Fehler:', error);
    });
}


