import { updateByID } from "../api/feedback-api.js";

export class FeedbackView extends HTMLElement {
    static get observedAttributes() {
        return ["feedback-id", "status", "subject"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    // Getter/Setter für typsichere API
    get feedbackId(): number { return Number(this.getAttribute("feedback-id")); }
    set feedbackId(value: number) { this.setAttribute("feedback-id", value.toString()); }

    get status(): string { return this.getAttribute("status") || ""; }
    set status(value: string) { this.setAttribute("status", value); }

    get subject(): string { return this.getAttribute("subject") || ""; }
    set subject(value: string) { this.setAttribute("subject", value); }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
    :host {
        display: block;
        margin: 1.5vh 0;
        font-family: var(--ff);
    }

    .feedbackItem {
        border-radius: 16px;
        padding: 2%;
        background: linear-gradient(var(--light), var(--light)) padding-box,
                    linear-gradient(90deg, var(--colorDark), var(--colorLight)) border-box;
        border: 2px solid transparent;
        box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        display: grid;
        gap: 1vh;
        
    }

    h3 {
        font-size: var(--xl);
        margin: 0;
        color: var(--fdark);
        font-weight: 700;
    }

    p {
        margin: 0;
        font-size: var(--lg);
        color: var(--fgrey);
    }

    .statusText {
        text-transform: uppercase;
        font-weight: bold;
    }

    .editStatusButton {
        border-radius: 12px;
        padding: 10px 14px;
        font-size: var(--lg);
        cursor: pointer;
        font-weight: bold;
        text-align: center;
        border: none;
        transition: 0.25s transform;
    }

    .editStatusButton:hover {
        transform: translateY(3px);
    }

    /* Status-spezifisches Button-Styling */
    .neu {
        background: linear-gradient(182deg, var(--colorLight), var(--colorDark));
        color: var(--fwhite);
    }

    .bearbeitung {
        background: #FFF;
        border: 2px solid var(--colorLight);
        color: var(--fgrey);
    }

    .erledigt {
        background: #CCC;
        color: var(--fdark);
    }
</style>


    <div class="feedbackItem">
        <h3>${this.subject}</h3>
        <p class="statusText">Status: ${this.status}</p>

        ${
            this.status === "Neu"
                ? `<button class="editStatusButton neu" data-status="In Bearbeitung">Jetzt bearbeiten</button>`
                : this.status === "In Bearbeitung"
                ? `<button class="editStatusButton bearbeitung" data-status="Erledigt">Jetzt fertigstellen</button>`
                : `<button class="editStatusButton erledigt" disabled>Erledigt</button>`
        }
        </div>
        `;

        this.shadowRoot.querySelectorAll(".editStatusButton").forEach(btn => {
            btn.addEventListener("click", async () => {
                const newStatus = btn.getAttribute("data-status")!;
                // Custom Event feuern statt direkt API? Hier direkt nutzen
                await updateByID(this.feedbackId, newStatus);
                this.status = newStatus; // UI automatisch aktualisieren
            });
        });
    }
}

customElements.define("feedback-view", FeedbackView);
