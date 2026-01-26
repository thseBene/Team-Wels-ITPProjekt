var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";
function renderFeedbackList() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("container");
        const headline = document.getElementById("headline");
        headline.textContent = "Verwaltung";
        if (!container)
            return;
        const feedbackList = yield getAllFeedback();
        console.log(feedbackList);
        container.innerHTML = ""; // leeren
        feedbackList.forEach(fb => {
            console.log(fb);
            const feedbackEl = document.createElement("feedback-view");
            feedbackEl.setAttribute("feedback-id", fb.id.toString());
            feedbackEl.setAttribute("subject", fb.subject);
            feedbackEl.setAttribute("userMail", fb.userMail);
            feedbackEl.setAttribute("status", fb.status);
            feedbackEl.setAttribute("datetime", new Date(fb.updatedAt).toLocaleDateString());
            container.appendChild(feedbackEl);
        });
    });
}
// initial render
renderFeedbackList();
// logging System
function logFeedbackSystem() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("container");
        container === null || container === void 0 ? void 0 : container.style.setProperty("display", "none");
        const headline = document.getElementById("headline");
        headline.textContent = "Logging";
        const logContainer = document.getElementById("logContainer");
        const logList = yield getLogSystem();
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
    });
}
//logFeedbackSystem();
