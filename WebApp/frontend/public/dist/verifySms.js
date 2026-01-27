"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_VERIFY = 'http://localhost:8080/api';
let phoneNumber = '';
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    // Telefonnummer aus URL holen
    const urlParams = new URLSearchParams(window.location.search);
    const rawTel = urlParams.get('tel') || '';
    // Leerzeichen ENTFERNEN, nicht ersetzen!
    phoneNumber = rawTel.trim();
    console.log('Raw Tel from URL:', rawTel);
    console.log('Processed phoneNumber:', phoneNumber);
    if (!phoneNumber) {
        alert('Keine Telefonnummer angegeben');
        return;
    }
    setupCodeInput();
    (_a = document.getElementById('verifyBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', verifyCode);
});
function setupCodeInput() {
    const inputs = document.querySelectorAll('.code-digit');
    const verifyBtn = document.getElementById('verifyBtn');
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            // Nur Zahlen
            if (!/^\d$/.test(value)) {
                input.value = '';
                return;
            }
            // Nächstes Feld
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            // Button aktivieren wenn alle ausgefüllt
            const allFilled = Array.from(inputs).every(i => i.value !== '');
            verifyBtn.disabled = !allFilled;
        });
        // Backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
    inputs[0].focus();
}
function verifyCode() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputs = document.querySelectorAll('.code-digit');
        const code = Array.from(inputs).map(i => i.value).join('');
        const verifyBtn = document.getElementById('verifyBtn');
        const errorMsg = document.getElementById('error');
        const successMsg = document.getElementById('success');
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Wird überprüft...';
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');
        console.log('=== VERIFY CODE ===');
        console.log('Telefonnummer:', phoneNumber);
        console.log('Code:', code);
        console.log('URL:', `http://localhost:8080/api/benutzer/verify-tel?tel=${encodeURIComponent(phoneNumber)}&code=${code}`);
        try {
            const response = yield fetch(`http://localhost:8080/api/benutzer/verify-tel?tel=${encodeURIComponent(phoneNumber)}&code=${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                },
                cache: 'no-store'
            });
            console.log('Response Status:', response.status);
            const data = yield response.json();
            console.log('Response Data:', data);
            if (response.ok) {
                // Erfolg
                successMsg.classList.add('show');
                inputs.forEach(i => i.disabled = true);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
            else {
                // Fehler
                errorMsg.textContent = data.message || 'Ungültiger Code';
                errorMsg.classList.add('show');
                inputs.forEach(i => i.value = '');
                inputs[0].focus();
                verifyBtn.disabled = true;
                verifyBtn.textContent = 'Bestätigen';
            }
        }
        catch (error) {
            console.error('Fetch Error:', error);
            errorMsg.textContent = 'Netzwerkfehler';
            errorMsg.classList.add('show');
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Bestätigen';
        }
    });
}
