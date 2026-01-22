"use strict";
class LogView extends HTMLElement {
    static get observedAttributes() {
        return ["action", "timestamp", "details"];
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
        var _a, _b, _c;
        if (!this.shadowRoot)
            return;
        const rawTs = this.getAttribute("timestamp");
        const formattedTimestamp = (() => {
            if (!rawTs)
                return "";
            const num = Number(rawTs);
            let d;
            if (!Number.isNaN(num) && rawTs.trim() !== "") {
                // if timestamp looks like seconds (10 digits) convert to ms
                d = new Date(num < 1e12 ? num * 1000 : num);
            }
            else {
                const parsed = Date.parse(rawTs);
                if (Number.isNaN(parsed))
                    return rawTs; // return original if unparsable
                d = new Date(parsed);
            }
            if (isNaN(d.getTime()))
                return rawTs;
            const pad = (n) => (n < 10 ? "0" + n : n.toString());
            const day = pad(d.getDate());
            const month = pad(d.getMonth() + 1);
            const year = d.getFullYear().toString().slice(-2);
            const hours = pad(d.getHours());
            const minutes = pad(d.getMinutes());
            return `${day}.${month}.${year} ${hours}:${minutes}`;
        })();
        this.shadowRoot.innerHTML = `
            <style>
        :host {
        display: block;
        margin: 1.5vh 0;
        font-family: var(--ff);
        }
        
        .logItem {
            width: 100%;
            border-radius: 16px;
            display: grid;
            grid-template-columns: 2% 85% 9% 3%;
            gap: 1vh;
            border-radius: 12px;
            border-left: 14px solid var(--Blue, #55B9E1);
            background: #FFF;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
            margin-bottom: 1vh;
            align-items: center;
            padding-left: 0.5%;
            box-sizing: border-box;
        }

        h3 {
        font-size: var(--xl);
        margin: 0;
        color: var(--fdark);
        font-weight: 700;
        }

        p {
        margin: 0;
        color: var(--fdark);
        font-size: var(--m);
        }
        i {
        color: #000;
        align-self: center;
        justify-self: center;
        }
        .openDetails {
            cursor: pointer;
            transition: transform 0.3s ease;
        }   
        .dateTimestamsp {
        color: #000;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 87.645%; /* 12.27px */
        opacity: 0.6;
        }
        
            </style>

            <div class="logItem">
            ${((_a = this.getAttribute('action')) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("login"))
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M409 337C418.4 327.6 418.4 312.4 409 303.1L265 159C258.1 152.1 247.8 150.1 238.8 153.8C229.8 157.5 224 166.3 224 176L224 256L112 256C85.5 256 64 277.5 64 304L64 336C64 362.5 85.5 384 112 384L224 384L224 464C224 473.7 229.8 482.5 238.8 486.2C247.8 489.9 258.1 487.9 265 481L409 337zM416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480z"/></svg>`
            : ((_b = this.getAttribute('action')) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("mail"))
                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>`
                : ((_c = this.getAttribute('action')) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes("created"))
                    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/></svg>`
                    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 240C302.3 240 288 254.3 288 272C288 285.3 277.3 296 264 296C250.7 296 240 285.3 240 272C240 227.8 275.8 192 320 192C364.2 192 400 227.8 400 272C400 319.2 364 339.2 344 346.5L344 350.3C344 363.6 333.3 374.3 320 374.3C306.7 374.3 296 363.6 296 350.3L296 342.2C296 321.7 310.8 307 326.1 302C332.5 299.9 339.3 296.5 344.3 291.7C348.6 287.5 352 281.7 352 272.1C352 254.4 337.7 240.1 320 240.1zM288 432C288 414.3 302.3 400 320 400C337.7 400 352 414.3 352 432C352 449.7 337.7 464 320 464C302.3 464 288 449.7 288 432z"/></svg>'}

            <p>${this.getAttribute("details")}</p>
            <p class="dateTimestamsp">${formattedTimestamp}</p>


            <svg class="openDetails"xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
                <path d="M17.5 1.5L9.5 10.5L1.5 1.5" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            </div>
        `;
    }
}
customElements.define("log-view", LogView);
