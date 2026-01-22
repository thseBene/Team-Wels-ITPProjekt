import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";

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
    container?.style.setProperty("display", "none");
    const logContainer = document.getElementById("logContainer") as HTMLElement;
    const logList = await getLogSystem();

    logContainer.innerHTML = "";

    logList.forEach(log => {
        const prevDate = logContainer.dataset.lastDate;
        const logDate = new Date(log.timestamp).toLocaleDateString();

        if (prevDate !== logDate) {
            const dateEl = document.createElement("div");
            dateEl.className = "log-date";
            dateEl.textContent = logDate;
            logContainer.appendChild(dateEl);
            logContainer.dataset.lastDate = logDate;
        }
        
        const el = document.createElement("log-view");
        el.setAttribute("action", log.actionType);
        el.setAttribute("timestamp", log.timestamp);
        el.setAttribute("details", log.details);
        logContainer.appendChild(el);
    });
}

logFeedbackSystem();