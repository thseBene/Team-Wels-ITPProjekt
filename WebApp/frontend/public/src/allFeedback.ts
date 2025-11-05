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

  for (const feedback of feedbackList) {
        document.getElementById('container')!.innerHTML += `
        <div class="feedbackItem">
            <h3>Feedback von: ${feedback.author}</h3>
            <p>${feedback.message}</p>
        </div>
        `;
  }

}
getAllFeedback();