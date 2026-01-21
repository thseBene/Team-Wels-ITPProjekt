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
        if (!container)
            return;
        const feedbackList = yield getAllFeedback();
        container.innerHTML = ""; // leeren
        feedbackList.forEach(fb => {
            const feedbackEl = document.createElement("feedback-view");
            feedbackEl.feedbackId = fb.id;
            feedbackEl.subject = fb.subject;
            feedbackEl.status = fb.status;
            container.appendChild(feedbackEl);
        });
    });
}
// initial render
// renderFeedbackList();
// logging System
function logFeedbackSystem() {
    return __awaiter(this, void 0, void 0, function* () {
        const logContainer = document.getElementById("logContainer");
        const logList = yield getLogSystem();
        logContainer.innerHTML = "";
        logList.forEach(log => {
            const el = document.createElement("log-view");
            el.setAttribute("action", log.actionType);
            el.setAttribute("timestamp", log.timestamp);
            el.setAttribute("details", log.details);
            logContainer.appendChild(el);
        });
    });
}
logFeedbackSystem();
