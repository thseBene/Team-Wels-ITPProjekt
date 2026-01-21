import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
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
// renderFeedbackList();

// logging System
async function logFeedbackSystem() {
      const container = document.getElementById("container");
    if (!container) return;

    const logList = await getLogSystem();
}
logFeedbackSystem();