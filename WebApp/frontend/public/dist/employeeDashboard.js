var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e;
import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";
import "./components/ListViewFeedback.js";
let allFeedback = [];
(_a = document.getElementById('listView')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    var _a, _b, _c;
    renderFeedbackList();
    (_a = document.getElementById('logIcon')) === null || _a === void 0 ? void 0 : _a.classList.remove('selectedLog');
    (_b = document.getElementById('listView')) === null || _b === void 0 ? void 0 : _b.classList.add('selectedView');
    (_c = document.getElementById('boxView')) === null || _c === void 0 ? void 0 : _c.classList.remove('selectedView');
});
(_b = document.getElementById('boxView')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    var _a, _b, _c;
    renderFeedbackBox();
    (_a = document.getElementById('logIcon')) === null || _a === void 0 ? void 0 : _a.classList.remove('selectedLog');
    (_b = document.getElementById('boxView')) === null || _b === void 0 ? void 0 : _b.classList.add('selectedView');
    (_c = document.getElementById('listView')) === null || _c === void 0 ? void 0 : _c.classList.remove('selectedView');
});
(_c = document.getElementById('logIcon')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    var _a, _b, _c;
    (_a = document.getElementById('logIcon')) === null || _a === void 0 ? void 0 : _a.classList.add('selectedLog');
    (_b = document.getElementById('boxView')) === null || _b === void 0 ? void 0 : _b.classList.remove('selectedView');
    (_c = document.getElementById('listView')) === null || _c === void 0 ? void 0 : _c.classList.remove('selectedView');
    logFeedbackSystem();
});
(_d = document.getElementById('searchBar')) === null || _d === void 0 ? void 0 : _d.addEventListener('keyup', (event) => {
    if (event.key === 'Enter')
        event.preventDefault();
    const searchTerm = event.target.value.toLowerCase();
    const container = document.getElementById('container');
    const logContainer = document.getElementById("logContainer");
    logContainer.innerHTML = "";
    if (!container)
        return;
    const feedbackItems = container.children;
    Array.from(feedbackItems).forEach(item => {
        var _a, _b;
        const subject = ((_a = item.getAttribute('subject')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        const userMail = ((_b = item.getAttribute('userMail')) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
        if (subject.includes(searchTerm) || userMail.includes(searchTerm)) {
            item.style.display = '';
        }
        else {
            item.style.display = 'none';
        }
    });
});
(_e = document.getElementById('sortSelect')) === null || _e === void 0 ? void 0 : _e.addEventListener('change', () => {
    filterList();
});
function filterList() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const container = document.getElementById('container');
        if (!container)
            return;
        const sortValue = document.getElementById('sortSelect').value;
        // Ensure we have the source data; fetch if cache is empty
        if (!allFeedback || allFeedback.length === 0) {
            try {
                allFeedback = yield getAllFeedback();
            }
            catch (err) {
                console.error('Failed to fetch feedback for filtering', err);
                return;
            }
        }
        // work on a copy of the data
        let filtered = [...allFeedback];
        switch (sortValue) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'finished':
                filtered = filtered.filter(f => f.status === 'Erledigt');
                break;
            case 'inProcess':
                filtered = filtered.filter(f => f.status === 'In Bearbeitung');
                break;
            case 'notStarted':
                filtered = filtered.filter(f => f.status === 'Neu');
                break;
            default:
            // no-op, already have all items
        }
        // determine current view mode (list vs box) to render appropriate custom elements
        const isListView = ((_a = document.getElementById('listView')) === null || _a === void 0 ? void 0 : _a.classList.contains('selectedView')) === true;
        container.innerHTML = ''; // clear existing items
        filtered.forEach(fb => {
            const feedbackEl = isListView
                ? document.createElement('list-view-feedback')
                : document.createElement('feedback-view');
            feedbackEl.setAttribute('feedback-id', fb.id.toString());
            feedbackEl.setAttribute('subject', fb.subject);
            feedbackEl.setAttribute('userMail', fb.userMail);
            feedbackEl.setAttribute('status', fb.status);
            feedbackEl.setAttribute('datetime', new Date(fb.createdAt).toLocaleDateString());
            container.appendChild(feedbackEl);
        });
    });
}
function renderFeedbackBox() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("container");
        const headline = document.getElementById("headline");
        const logContainer = document.getElementById("logContainer");
        logContainer.innerHTML = "";
        headline.textContent = "Verwaltung";
        if (!container)
            return;
        const cols = Number(sessionStorage.getItem('dashboardCols')) || 3;
        container.style = `display: grid; grid-template-columns: repeat(${cols}, 1fr);`; // reset style
        const feedbackList = yield getAllFeedback();
        allFeedback = feedbackList;
        console.log(feedbackList);
        container.innerHTML = ""; // leeren
        feedbackList.forEach(fb => {
            console.log(fb);
            const feedbackEl = document.createElement("feedback-view");
            feedbackEl.setAttribute("feedback-id", fb.id.toString());
            feedbackEl.setAttribute("subject", fb.subject);
            feedbackEl.setAttribute("userMail", fb.userMail);
            feedbackEl.setAttribute("status", fb.status);
            feedbackEl.setAttribute("datetime", new Date(fb.createdAt).toLocaleDateString());
            container.appendChild(feedbackEl);
        });
        filterList();
    });
}
function renderFeedbackList() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById("container");
        const headline = document.getElementById("headline");
        const logContainer = document.getElementById("logContainer");
        logContainer.innerHTML = "";
        headline.textContent = "Verwaltung";
        if (!container)
            return;
        const feedbackList = yield getAllFeedback();
        allFeedback = feedbackList;
        console.log(feedbackList);
        container.innerHTML = ""; // leeren
        container.style = 'display: grid; grid-template-columns: 1fr;';
        feedbackList.forEach(fb => {
            console.log(fb);
            const feedbackEl = document.createElement("list-view-feedback");
            feedbackEl.setAttribute("feedback-id", fb.id.toString());
            feedbackEl.setAttribute("subject", fb.subject);
            feedbackEl.setAttribute("userMail", fb.userMail);
            feedbackEl.setAttribute("status", fb.status);
            feedbackEl.setAttribute("datetime", new Date(fb.createdAt).toLocaleDateString());
            container.appendChild(feedbackEl);
        });
        filterList();
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
        // ensure a default of 3 columns is set and visually mark that option in the popup
        const defaultCols = sessionStorage.getItem('dashboardCols') || '3';
        if (!sessionStorage.getItem('dashboardCols'))
            sessionStorage.setItem('dashboardCols', defaultCols);
        // highlight the button that matches the current columns, reset others
        Array.from(popup.querySelectorAll('.viewOption')).forEach(el => {
            const btn = el;
            btn.style.background = btn.dataset.cols === defaultCols ? '#e0e7ff' : '#f5f5f5';
        });
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
        sessionStorage.setItem('dashboardCols', cols.toString());
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
