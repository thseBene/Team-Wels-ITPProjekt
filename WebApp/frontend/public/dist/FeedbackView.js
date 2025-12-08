"use strict";
class FeedbackView extends HTMLElement {
    static get observedAttributes() {
        return ["id", "status", "subject"];
    }
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
    attributeChangedCallback() {
        this.render();
    }
    render() {
        const id = this.getAttribute("id");
        const status = this.getAttribute("status");
        const subject = this.getAttribute("subject");
        if (this.shadowRoot == null)
            return;
        this.shadowRoot.innerHTML = `
            <style>
                .feedbackItem {
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin: 10px 0;
                }
                .editStatus {
                    color: blue;
                    cursor: pointer;
                    text-decoration: underline;
                }
            </style>

            <div class="feedbackItem">
                <h3>${subject}</h3>
                ${status ? `<p>Status: ${status}</p>` : ""}

                ${status === "Neu" ? `
                    <button class="editStatus" data-status="In Bearbeitung">Jetzt bearbeiten</button>
                ` : ""}

                ${status === "In Bearbeitung" ? `
                    <button class="editStatus" data-status="Erledigt">Jetzt fertigstellen</button>
                ` : ""}
            </div>
        `;
        // Event Listener für Buttons im Shadow DOM
        this.shadowRoot.querySelectorAll(".editStatus").forEach(btn => {
            btn.addEventListener("click", () => {
                const newStatus = btn.getAttribute("data-status");
                const idNum = id ? Number(id) : NaN;
                if (!newStatus) {
                    console.warn("Kein data-status-Attribut vorhanden, Abbruch.");
                    return;
                }
                if (isNaN(idNum)) {
                    console.warn("Ungültige ID, Abbruch.");
                    return;
                }
                updateByID(idNum, newStatus);
            });
        });
    }
    getId() {
        const id = this.getAttribute("id");
        return id ? Number(id) : NaN;
    }
}
customElements.define("feedback-view", FeedbackView);
