var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { updateByID } from "../api/feedback-api.js";
class FeedbackView extends HTMLElement {
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
    render() {
        var _a, _b, _c, _d, _e;
        if (!this.shadowRoot)
            return;
        const feedbackId = Number((_a = this.getAttribute("feedback-id")) !== null && _a !== void 0 ? _a : "0");
        const status = (_b = this.getAttribute("status")) !== null && _b !== void 0 ? _b : "";
        const subject = (_c = this.getAttribute("subject")) !== null && _c !== void 0 ? _c : "";
        const userMail = (_d = this.getAttribute("userMail")) !== null && _d !== void 0 ? _d : "";
        const datetime = (_e = this.getAttribute("datetime")) !== null && _e !== void 0 ? _e : "";
        this.shadowRoot.innerHTML = `
            <style>
    :host {
        display: block;
        margin: 1.5vh 0;
        font-family: var(--ff);
    }

    .feedbackItem {
        border-radius: 12px;
        border-left: 14px solid var(--Blue, #55B9E1);
        background: #FFF;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
        padding: 1%;
        padding-left: 2%;
        padding-bottom: 7%;
    }

    h3 {
        color: #000;
        font-family: Inter;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: 87.645%;
        margin-bottom: 0;
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
        margin-top: 1vh;
    }
    .gridHead {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .editStatusButton {
        border-radius: 12px;
        padding: 10px 14px;
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
            padding: 6px 8px;
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
        <div class="gridHead">
            <h3>${subject}</h3>

            ${status === "Neu"
            ? `<svg class="editStatusButton neu" data-status="In Bearbeitung" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#E2001A"/>
                    </svg>`
            : status === "In Bearbeitung"
                ? `<svg class="editStatusButton bearbeitung" data-status="Erledigt" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <circle cx="9.5" cy="9.5" r="9.5" fill="#EAA100"/>
                    </svg>`
                : `<svg class="editStatusButton erledigt" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <circle cx="9.5" cy="9.5" r="9.5" fill="#B2C900"/>
                    </svg>`}
        </div>
        <p class="subline">von ${userMail}, ${datetime}</p>


        

        
    </div>
        `;
        // attach event listeners
        const buttons = this.shadowRoot.querySelectorAll(".editStatusButton");
        buttons.forEach(btn => {
            btn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const newStatus = btn.getAttribute("data-status");
                if (!newStatus)
                    return;
                try {
                    yield updateByID(feedbackId, newStatus);
                    // update attribute so attributeChangedCallback / render reflect change
                    this.setAttribute("status", newStatus);
                }
                catch (err) {
                    console.error("Failed to update feedback status:", err);
                }
            }));
        });
    }
}
customElements.define("feedback-view", FeedbackView);
