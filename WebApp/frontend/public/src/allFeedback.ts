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
}
getAllFeedback();