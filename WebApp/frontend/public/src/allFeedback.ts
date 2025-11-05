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
    
        if (feedback.author == 'Anonym' || feedback.author == null || feedback.author == '') {
            html += `<h3>Anonym</h3>`;
        }
        else {
            html += `<h3>Von: ${feedback.author}</h3>`;
        }
        html += `
            <p>${feedback.message}</p>
        </div>
        `;
  }
  document.getElementById('container')!.innerHTML = html;
}
getAllFeedback();
        


