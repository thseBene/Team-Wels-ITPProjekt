import { updateByID } from "../api/feedback-api.js";

class ListViewFeedback extends HTMLElement {
    static get observedAttributes() {
        return ["feedback-id", "status", "subject", "userMail", "datetime"];
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

    render(): void {
        if (!this.shadowRoot) return;

        const feedbackId = Number(this.getAttribute("feedback-id") ?? "0");
        const status = this.getAttribute("status") ?? "";
        const subject = this.getAttribute("subject") ?? "";
        const userMail = this.getAttribute("userMail") ?? "";
        const datetime = this.getAttribute("datetime") ?? "";

        this.shadowRoot.innerHTML = `
            <style>
    :host {
        display: block;
        margin: 1.5vh 0;
        font-family: var(--ff);
    }

    .feedbackItem {
        display: grid;
        grid-template-columns: 50% 30% 18% 2%;
        border-radius: 12px;
        border-left: 14px solid var(--Blue, #55B9E1);
        background: #FFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        align-items: center;
        padding: 0.5%;
        padding-left: 1%;
        margin-bottom: -1vh;
    }


    /* reset heading default margins */
    h3 {
        margin: 0;
        padding: 0;
        color: #000;
        font-family: Inter;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 87.645%;
    }


    p {
        margin: 0;
        font-size: var(--lg);
        color: var(--fgrey);
    }

    .subline {
       color: var(--Decent-Text, #595959);
        font-family: Inter;
        font-size: 14px;
        font-style: italic;
        font-weight: 600;
        line-height: 87.645%;
    }


    .editStatusButton {
        border-radius: 12px;
        font-size: var(--lg);
        cursor: pointer;
        text-align: center;
        border: none;
    }

    .editStatusButton:hover {
        }
        .editStatusButton {
            position: relative;
        }
        .editStatusButton::after {
            content: "Bearbeiten";
            position: absolute;
            top: -38px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.85);
            color: #fff;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            z-index: 10;
            transition: opacity .12s ease, transform .12s ease;
        }
        .editStatusButton:hover::after {
            opacity: 1;
            transform: translateX(-50%) translateY(-4px);
        }
    }

    .neu {
        background: linear-gradient(182deg, var(--colorLight), var(--colorDark));
        color: var(--fwhite);
    }

    .bearbeitung {
        background: #FFF;
        border: 2px solid var(--colorLight);
        color: var(--fgrey);
    }

  
</style>

    <div class="feedbackItem">
            <h3>${subject}</h3>
        <p class="subline">von ${userMail}, ${datetime}</p>

        <p></p>
            ${
            status === "Neu"
                ? `<svg class="editStatusButton neu" data-status="In Bearbeitung" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#E2001A"/>
                    </svg>`
                : status === "In Bearbeitung"
                ? `<svg class="editStatusButton bearbeitung" data-status="Erledigt" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <circle cx="9.5" cy="9.5" r="9.5" fill="#EAA100"/>
                    </svg>`
                : `<svg class="editStatusButton erledigt" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#B2C900"/>
                    </svg>`
        }


        

        
    </div>
        `;

        // attach event listeners
        const buttons = this.shadowRoot.querySelectorAll<HTMLButtonElement>(".editStatusButton");
        buttons.forEach(btn => {
            btn.addEventListener("click", async () => {
                const newStatus = btn.getAttribute("data-status");
                if (!newStatus) return;
                try {
                    await updateByID(feedbackId, newStatus);
                    // update attribute so attributeChangedCallback / render reflect change
                    this.setAttribute("status", newStatus);
                } catch (err) {
                    console.error("Failed to update feedback status:", err);
                }
            });
        });
    }
}

customElements.define("list-view-feedback", ListViewFeedback);
