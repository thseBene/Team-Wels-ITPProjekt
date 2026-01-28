export interface Feedback {
    id: number;
    createdAt: string;
    description: string;
    type: string;
    subject: string;
    userId: number;
    userMail: string;
    userTel: string;
    message: string;
    updatedAt: string;
    status: string;
}
export interface Activitylog {
    id: number;
    actionType: string;
    details: string;
    timestamp: string;
    oldValue?: string;
    newValue?: string;
    mitarbeiter?: {
        id: number;
        benutzername: string;
        vorname: string;
        nachname: string;
        abteilung: string;
        aktiv: boolean;
    };
}
const baseUrl = "http://localhost:8080";

// Holen aller Feedbacks
export async function getAllFeedback(): Promise<Feedback[]> {
    const res = await fetch(`${baseUrl}/api/feedback`);
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Abrufen: ${res.status}`);
    return res.json();
}

// Update Status
export async function updateByID(id: number, newStatus: string): Promise<void> {
    const res = await fetch(`${baseUrl}/api/feedback/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            status: newStatus,
            userId: localStorage.getItem('employeeId')
        })
    });
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Aktualisieren: ${res.status}`);
}

// Delete
export async function deleteByID(id: number): Promise<void> {
    const res = await fetch(`${baseUrl}/api/feedback/${id}`, { method: "DELETE" });
    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Löschen: ${res.status}`);
}


export async function employeeLogin(benutzername: string, passwort: string): Promise<void> {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ benutzername, passwort }),
    });

    console.log(res);
    let data = await res.json();

    localStorage.setItem('employeeId', data.id);
    if (!res.ok) throw new Error(`Fehler beim Login: ${res.status}`);
    
}
export async function getLogSystem(): Promise<Activitylog[]> {
    const res = await fetch(`${baseUrl}/api/activitylog`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Abrufen der Logs: ${res.status}`);
    
    const data = await res.json();
    console.log('Log Daten ', data);
    return data;
}
export async function getLogById(id: number): Promise<Activitylog> {
    const res = await fetch(`${baseUrl}/api/activitylog/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log(res);
    if (!res.ok) throw new Error(`Fehler beim Abrufen des Logs: ${res.status}`);
    
    const data = await res.json();
    console.log('Log Daten ', data);
    return data;
}