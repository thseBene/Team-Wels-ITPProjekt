import { getAllFeedback, getLogSystem } from "./api/feedback-api.js";
import "./components/FeedbackView.js";
import "./components/LogView.js";
import "./components/ListViewFeedback.js";

let allFeedback: any[] = [];



  document.getElementById('listView')?.addEventListener('click', () => {
      renderFeedbackList();
      document.getElementById('logIcon')?.classList.remove('selectedLog');
      document.getElementById('listView')?.classList.add('selectedView');
      document.getElementById('boxView')?.classList.remove('selectedView');
  });

  document.getElementById('boxView')?.addEventListener('click', () => { 
      renderFeedbackBox();
      document.getElementById('logIcon')?.classList.remove('selectedLog');
      document.getElementById('boxView')?.classList.add('selectedView');
      document.getElementById('listView')?.classList.remove('selectedView');
  });

  document.getElementById('logIcon')?.addEventListener('click', () => {
      document.getElementById('logIcon')?.classList.add('selectedLog');
      document.getElementById('boxView')?.classList.remove('selectedView');
      document.getElementById('listView')?.classList.remove('selectedView');
      logFeedbackSystem();
  });

  document.getElementById('searchBar')?.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') event.preventDefault();

      const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
      const container = document.getElementById('container');

      const logContainer = document.getElementById("logContainer") as HTMLElement;
      logContainer.innerHTML = "";

      if (!container) return;
      const feedbackItems = container.children;
      Array.from(feedbackItems).forEach(item => {
          const subject = item.getAttribute('subject')?.toLowerCase() || '';
          const userMail = item.getAttribute('userMail')?.toLowerCase() || '';
          if (subject.includes(searchTerm) || userMail.includes(searchTerm)) {
              (item as HTMLElement).style.display = '';
          } else {
              (item as HTMLElement).style.display = 'none';
          }
      });
  });

  document.getElementById('sortSelect')?.addEventListener('change', () => {
  async function filterList() {
      const container = document.getElementById('container');
      if (!container) return;

      const sortValue = (document.getElementById('sortSelect') as HTMLSelectElement).value;

      // Ensure we have the source data; fetch if cache is empty
      if (!allFeedback || allFeedback.length === 0) {
          try {
              allFeedback = await getAllFeedback();
          } catch (err) {
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

   const isListView = document.getElementById('listView')?.classList.contains('selectedView') === true;
      container.innerHTML = ''; // clear existing items
      
      filtered.forEach(fb => {
          const feedbackEl = isListView
              ? document.createElement('list-view-feedback') as any
              : document.createElement('feedback-view') as any;
          feedbackEl.setAttribute('feedback-id', fb.id.toString());
          feedbackEl.setAttribute('subject', fb.subject);
          feedbackEl.setAttribute('userMail', fb.userMail);
          feedbackEl.setAttribute('status', fb.status);
          feedbackEl.setAttribute('datetime', new Date(fb.createdAt).toLocaleDateString());

          container.appendChild(feedbackEl);
      });
  }
  filterList();
});



    
async function renderFeedbackBox() {
    const container = document.getElementById("container");
    const headline = document.getElementById("headline");

    const logContainer = document.getElementById("logContainer") as HTMLElement;
    logContainer.innerHTML = "";

    headline!.textContent = "Verwaltung";
    if (!container) return;
    const cols = Number(sessionStorage.getItem('dashboardCols')) || 3;
    container.style = `display: grid; grid-template-columns: repeat(${cols}, 1fr);`; // reset style
    const feedbackList = await getAllFeedback();
    allFeedback = feedbackList;
    console.log(feedbackList);

    container.innerHTML = ""; // leeren
    feedbackList.forEach(fb => {
        console.log(fb);
        const feedbackEl = document.createElement("feedback-view") as any;
        feedbackEl.setAttribute("feedback-id", fb.id.toString());
        feedbackEl.setAttribute("subject", fb.subject);
        feedbackEl.setAttribute("userMail", fb.userMail);
        feedbackEl.setAttribute("status", fb.status);
        feedbackEl.setAttribute("datetime", new Date(fb.createdAt).toLocaleDateString());

        container.appendChild(feedbackEl);
    });
}
async function renderFeedbackList() {
    const container = document.getElementById("container");
    const headline = document.getElementById("headline");

    const logContainer = document.getElementById("logContainer") as HTMLElement;
    logContainer.innerHTML = "";

    headline!.textContent = "Verwaltung";
    if (!container) return;
    
    const feedbackList = await getAllFeedback();
    allFeedback = feedbackList;
    console.log(feedbackList);
    container.innerHTML = ""; // leeren
    container.style = 'display: grid; grid-template-columns: 1fr;';

    feedbackList.forEach(fb => {
        console.log(fb);
        const feedbackEl = document.createElement("list-view-feedback") as any;
        feedbackEl.setAttribute("feedback-id", fb.id.toString());
        feedbackEl.setAttribute("subject", fb.subject);
        feedbackEl.setAttribute("userMail", fb.userMail);
        feedbackEl.setAttribute("status", fb.status);
        feedbackEl.setAttribute("datetime", new Date(fb.createdAt).toLocaleDateString());

        container.appendChild(feedbackEl);
    });

   
    
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
                sessionStorage.setItem('dashboardCols', cols.toString());
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
                