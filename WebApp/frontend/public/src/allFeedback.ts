<<<<<<< Updated upstream
import { getAllFeedback } from "./api/feedback-api.js";
import "./components/FeedbackView.js";

async function renderFeedbackList() {
    const container = document.getElementById("container");
    if (!container) return;

    const feedbackList = await getAllFeedback();

    container.innerHTML = ""; // leeren
    feedbackList.forEach(fb => {
        const feedbackEl = document.createElement("feedback-view") as any;
        feedbackEl.feedbackId = fb.id;
        feedbackEl.subject = fb.subject;
        feedbackEl.status = fb.status;

        container.appendChild(feedbackEl);
    });
}

// initial render
renderFeedbackList();
=======
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
        
        html += `
            <p>${feedback.description}</p>
            
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


>>>>>>> Stashed changes
