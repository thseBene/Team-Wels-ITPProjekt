import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";

async function renderFeedbackList() {
    const container = document.getElementById("container");
    const headline = document.getElementById("headline");
    headline!.textContent = "Verwaltung";
    if (!container) return;

    const feedbackList = await getAllFeedback();
    console.log(feedbackList);

    container.innerHTML = ""; // leeren
    feedbackList.forEach(fb => {
        console.log(fb);
        const feedbackEl = document.createElement("feedback-view") as any;
        feedbackEl.setAttribute("feedback-id", fb.id.toString());
        feedbackEl.setAttribute("subject", fb.subject);
        feedbackEl.setAttribute("userMail", fb.userMail);
        feedbackEl.setAttribute("status", fb.status);
        feedbackEl.setAttribute("datetime", new Date(fb.updatedAt).toLocaleDateString());

        container.appendChild(feedbackEl);
    });
}

// initial render
renderFeedbackList();

// logging System

async function logFeedbackSystem() {
    const container = document.getElementById("container");
    container?.style.setProperty("display", "none");
    const headline = document.getElementById("headline");
    headline!.textContent = "Logging";
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
        el.setAttribute("id", log.id.toString());
        logContainer.appendChild(el);
    });
}
//logFeedbackSystem();