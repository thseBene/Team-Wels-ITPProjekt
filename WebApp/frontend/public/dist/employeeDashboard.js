var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";
(_a = document.getElementById('listView')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    var _a, _b;
    renderFeedbackList();
    (_a = document.getElementById('listView')) === null || _a === void 0 ? void 0 : _a.classList.add('selectedView');
    (_b = document.getElementById('boxView')) === null || _b === void 0 ? void 0 : _b.classList.remove('selectedView');
});
(_b = document.getElementById('boxView')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    var _a, _b;
    renderFeedbackBox();
    (_a = document.getElementById('boxView')) === null || _a === void 0 ? void 0 : _a.classList.add('selectedView');
    (_b = document.getElementById('listView')) === null || _b === void 0 ? void 0 : _b.classList.remove('selectedView');
});
function renderFeedbackBox() {
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
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        ["ID", "Betreff", "E-Mail", "Status", "Datum"].forEach(headerText => {
            const th = document.createElement("th");
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        feedbackList.forEach(fb => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            idCell.textContent = fb.id.toString();
            row.appendChild(idCell);
            const subjectCell = document.createElement("td");
            subjectCell.textContent = fb.subject;
            row.appendChild(subjectCell);
            const emailCell = document.createElement("td");
            emailCell.textContent = fb.userMail;
            row.appendChild(emailCell);
            const statusCell = document.createElement("td");
            statusCell.textContent = fb.status;
            row.appendChild(statusCell);
            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(fb.updatedAt).toLocaleDateString();
            row.appendChild(dateCell);
            table.appendChild(row);
        });
        container.appendChild(table);
    });
}
// initial render
renderFeedbackBox();
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
// Switch between column views
(() => {
    const box = document.getElementById('boxView');
    const popup = document.getElementById('viewOptions');
    const container = document.getElementById('container');
    // if any of the required elements is missing, do nothing
    if (!box || !popup || !container)
        return;
    let longPressTimer = null;
    const showPopup = (x, y) => {
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        popup.style.display = 'flex';
        // stop text selection on long press
        document.body.style.userSelect = 'none';
    };
    const hidePopup = () => {
        popup.style.display = 'none';
        document.body.style.userSelect = '';
    };
    const startPress = (ev) => {
        ev.preventDefault();
        const rect = box.getBoundingClientRect();
        // show popup slightly below the icon
        const x = rect.left;
        const y = rect.bottom + 8;
        longPressTimer = window.setTimeout(() => showPopup(x, y), 400);
    };
    const cancelPress = () => {
        if (longPressTimer !== null) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };
    // mouse events
    box.addEventListener('mousedown', startPress);
    document.addEventListener('mouseup', () => { cancelPress(); });
    box.addEventListener('mouseleave', cancelPress);
    // touch events
    box.addEventListener('touchstart', startPress, { passive: false });
    document.addEventListener('touchend', () => { cancelPress(); }, { passive: true });
    document.addEventListener('touchcancel', cancelPress, { passive: true });
    // choose option
    popup.addEventListener('click', (e) => {
        const target = e.target;
        const btn = target === null || target === void 0 ? void 0 : target.closest('.viewOption');
        if (!btn)
            return;
        const cols = Number(btn.dataset.cols) || 3;
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        // mark chosen button visually
        Array.from(popup.querySelectorAll('.viewOption')).forEach(b => b.style.background = '#f5f5f5');
        btn.style.background = '#e0e7ff';
        hidePopup();
    });
    // hide when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && !popup.contains(target) && target !== box)
            hidePopup();
    });
    // keyboard: open popup with Enter on focused icon (short press)
    box.tabIndex = 0;
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const rect = box.getBoundingClientRect();
            showPopup(rect.left, rect.bottom + 8);
            e.preventDefault();
        }
    });
    hidePopup();
})();
