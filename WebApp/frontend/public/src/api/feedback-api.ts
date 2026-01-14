export interface Feedback {
    id: number;
    subject: string;
    status: string;
}

// Holen aller Feedbacks
export async function getAllFeedback(): Promise<Feedback[]> {
    const res = await fetch("http://localhost:8080/api/feedback");
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Abrufen: ${res.status}`);
    return res.json();
}

// Update Status
export async function updateByID(id: number, newStatus: string): Promise<void> {
    const res = await fetch(`http://localhost:8080/api/feedback/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Aktualisieren: ${res.status}`);
}

// Delete
export async function deleteByID(id: number): Promise<void> {
    const res = await fetch(`http://localhost:8080/api/feedback/${id}`, { method: "DELETE" });
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Löschen: ${res.status}`);
}


export async function employeeLogin(benutzername: string, passwort: string): Promise<void> {
    const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ benutzername, passwort }),
    });

    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Login: ${res.status}`);
    
    const data = await res.json();
    console.log('Daten ', data);

}