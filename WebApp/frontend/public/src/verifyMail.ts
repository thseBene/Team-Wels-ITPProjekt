// Automatisch beim Laden verifizieren
document.addEventListener('DOMContentLoaded', () => {
    verifyEmail();
});

async function verifyEmail() {
    // Token aus URL holen
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token:', token);
    if (!token) {
        showError('Kein Token gefunden');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/benutzer/verify-email?token=${token}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess();
            // Nach 3 Sekunden weiterleiten
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showError(data. message || 'Verifizierung fehlgeschlagen');
        }

    } catch (error) {
        showError('Netzwerkfehler');
    }
}

function showSuccess() {
    document.getElementById('loading')!.classList.add('hidden');
    document.getElementById('error')!.classList.add('hidden');
    document.getElementById('success')!.classList.remove('hidden');
}

function showError(message: string) {
    document.getElementById('loading')!.classList.add('hidden');
    document.getElementById('success')!.classList.add('hidden');
    document.getElementById('error')!.classList.remove('hidden');
    document.getElementById('errorText')!.textContent = message;
}