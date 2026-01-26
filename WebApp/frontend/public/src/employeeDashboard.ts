import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";



    document.getElementById('listView')?.addEventListener('click', () => {
        renderFeedbackList();
        document.getElementById('listView')?.classList.add('selectedView');
        document.getElementById('boxView')?.classList.remove('selectedView');
    });

    document.getElementById('boxView')?.addEventListener('click', () => {
        renderFeedbackBox();
        document.getElementById('boxView')?.classList.add('selectedView');
        document.getElementById('listView')?.classList.remove('selectedView');
    });


async function renderFeedbackBox() {
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
async function renderFeedbackList() {
    const container = document.getElementById("container");
    const headline = document.getElementById("headline");
    headline!.textContent = "Verwaltung";
    if (!container) return;
    
    const feedbackList = await getAllFeedback();
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
}
// initial render
renderFeedbackBox();

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


// Switch between column views
(() => {
              const box = document.getElementById('boxView');
              const popup = document.getElementById('viewOptions');
              const container = document.getElementById('container');

              // if any of the required elements is missing, do nothing
              if (!box || !popup || !container) return;

              let longPressTimer: number | null = null;

              const showPopup = (x: number, y: number) => {
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

              const startPress = (ev: MouseEvent | TouchEvent) => {
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
              box.addEventListener('mousedown', startPress as EventListener);
              document.addEventListener('mouseup', () => { cancelPress(); });
              box.addEventListener('mouseleave', cancelPress);

              // touch events
              box.addEventListener('touchstart', startPress as EventListener, {passive:false});
              document.addEventListener('touchend', () => { cancelPress(); }, {passive:true});
              document.addEventListener('touchcancel', cancelPress, {passive:true});

              // choose option
              popup.addEventListener('click', (e: MouseEvent) => {
                const target = e.target as HTMLElement | null;
                const btn = target?.closest('.viewOption') as HTMLElement | null;
                if (!btn) return;
                const cols = Number(btn.dataset.cols) || 3;
                container.style.display = 'grid';
                container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
                // mark chosen button visually
                Array.from(popup.querySelectorAll('.viewOption')).forEach(b => (b as HTMLElement).style.background = '#f5f5f5');
                btn.style.background = '#e0e7ff';
                hidePopup();
              });

              // hide when clicking outside
              document.addEventListener('click', (e: MouseEvent) => {
                const target = e.target as Node | null;
                if (target && !popup.contains(target) && target !== box) hidePopup();
              });

              // keyboard: open popup with Enter on focused icon (short press)
              box.tabIndex = 0;
              box.addEventListener('keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const rect = box.getBoundingClientRect();
                  showPopup(rect.left, rect.bottom + 8);
                  e.preventDefault();
                }
              });
              hidePopup();
            })();
                