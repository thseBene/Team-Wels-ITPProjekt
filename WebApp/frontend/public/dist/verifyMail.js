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
const API_BASE_VERFIY = 'http://localhost:8080/api';
// Automatisch beim Laden verifizieren
document.addEventListener('DOMContentLoaded', () => {
    verifyEmail();
});
function verifyEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        // Token aus URL holen
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (!token) {
            showError('Kein Token gefunden');
            return;
        }
        try {
            const response = yield fetch(`${API_BASE_VERIFY}/benutzer/verify-email?token=${token}`, {
                method: 'POST'
            });
            const data = yield response.json();
            if (response.ok) {
                showSuccess();
                // Nach 3 Sekunden weiterleiten
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
            else {
                showError(data.message || 'Verifizierung fehlgeschlagen');
            }
        }
        catch (error) {
            showError('Netzwerkfehler');
        }
    });
}
function showSuccess() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
}
function showError(message) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('success').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('errorText').textContent = message;
}
