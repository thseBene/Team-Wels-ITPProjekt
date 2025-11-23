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
const inputElement = document.getElementById('nameInput');
document.getElementById('nameInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        readInput();
    }
});
function readInput() {
    const inputValue = inputElement.value;
    console.log('Eingegebener Wert:', inputValue);
    checkType();
}
const API_BASE = 'http://localhost:8080/api';
// Lädt Benachrichtigungen basierend auf E-Mail
function checkType() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputValue = inputElement.value.trim();
        if (!inputValue) {
            showError('Bitte E-Mail-Adresse oder Telefonnummer eingeben');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telRegex = /^[+]?[\d\s\-()]{7,}$/;
        // Wenn Telefon erkannt -> direkt Telefonnummer-Flow ausführen und Funktion beenden
        if (telRegex.test(inputValue)) {
            try {
                yield loadNotifications(inputValue, 'SMS');
            }
            catch (error) {
                showError('Fehler beim Laden der Benachrichtigungen: ' + error);
            }
            return;
        }
        // Wenn es keine valide Telefonnummer ist, prüfen ob es eine E-Mail ist
        if (!emailRegex.test(inputValue)) {
            showError('Ungültige E-Mail-Adresse oder Telefonnummer');
            return;
        }
        // Für den nachfolgenden E-Mail-Flow
        const email = inputValue;
        try {
            // Dann Benachrichtigungen für diesen Benutzer laden
            yield loadNotifications(email, 'EMAIL');
        }
        catch (error) {
            showError('Fehler beim Laden der Benachrichtigungen: ' + error);
        }
    });
}
// Lädt Benachrichtigungen basierend auf Telefonnummer
// Lädt Benachrichtigungen für einen Benutzer
function loadNotifications(input_1) {
    return __awaiter(this, arguments, void 0, function* (input, filterTyp = null) {
        let fetchString;
        if (filterTyp == 'EMAIL') {
            fetchString = `${API_BASE}/notifications/mail/${input}`;
        }
        else {
            fetchString = `${API_BASE}/notifications/tel/${input}`;
        }
        const response = yield fetch(fetchString);
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Benachrichtigungen');
        }
        let notifications = yield response.json();
        // Optional: Nach Typ filtern (EMAIL oder SMS)
        if (filterTyp) {
            notifications = notifications.filter(n => n.typ === filterTyp);
        }
        displayNotifications(notifications);
        clearError();
    });
}
// Zeigt Benachrichtigungen an
function displayNotifications(notifications) {
    const container = document.getElementById('notificationsList');
    if (notifications.length === 0) {
        container.innerHTML = '<div class="no-notifications">Keine Benachrichtigungen gefunden</div>';
        return;
    }
    container.innerHTML = notifications.map(notification => `
        <div class="notification ${notification.gelesen ? '' : 'unread'}">
            <div class="notification-header">
                <span class="notification-type">${notification.typ} ${notification.gelesen ? '' : '(NEU)'}</span>
                <span class="notification-time">${formatDate(notification.createdAt)}</span>
            </div>
            ${notification.betreff ? `<h4>${notification.betreff}</h4>` : ''}
            <div class="notification-message">${notification.nachricht}</div>
            <div class="notification-actions">
                ${!notification.gelesen ? `
                    <button class="mark-read-btn" onclick="markAsRead(${notification.id})">
                        Als gelesen markieren
                    </button>
                ` : ''}
                <button class="delete-btn" onclick="deleteNotification(${notification.id})">
                    Löschen
                </button>
            </div>
        </div>
    `).join('');
}
// Markiert Benachrichtigung als gelesen
/*
async function markAsRead(notificationId: number) {
    try {
        const response = await fetch(`${API_BASE}/notifications/${notificationId}/gelesen`, {
            method: 'PATCH'
        });
        
        if (!response.ok) {
            throw new Error('Fehler beim Markieren als gelesen');
        }
        
        // Benachrichtigungen neu laden
        
        
        if (email) {
            loadNotificationsByEmail();
        } else if (tel) {
            loadNotificationsByTel();
        }
        
    } catch (error) {
        showError('Fehler: ' + error);
    }
}

// Löscht Benachrichtigung
async function deleteNotification(notificationId : number) {
    if (!confirm('Benachrichtigung wirklich löschen?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/notifications/${notificationId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Fehler beim Löschen');
        }
        
        // Benachrichtigungen neu laden
        const email = (document.getElementById('emailInput') as HTMLInputElement).value.trim();
        const tel = (document.getElementById('telInput') as HTMLInputElement).value.trim();
        
        if (email) {
            loadNotificationsByEmail();
        } else if (tel) {
            loadNotificationsByTel();
        }
        
    } catch (error) {
        showError('Fehler: ' + error);
    }
}
*/
// Hilfsfunktionen
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE');
}
function showError(message) {
    document.getElementById('error').textContent = message;
}
function clearError() {
    document.getElementById('error').textContent = '';
}
