var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Holen aller Feedbacks
export function getAllFeedback() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("http://localhost:8080/api/feedback");
        console.log(res);
        if (!res.ok)
            throw new Error(`Fehler beim Abrufen: ${res.status}`);
        return res.json();
    });
}
// Update Status
export function updateByID(id, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`http://localhost:8080/api/feedback/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        console.log(res);
        if (!res.ok)
            throw new Error(`Fehler beim Aktualisieren: ${res.status}`);
    });
}
// Delete
export function deleteByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`http://localhost:8080/api/feedback/${id}`, { method: "DELETE" });
        console.log(res);
        if (!res.ok)
            throw new Error(`Fehler beim Löschen: ${res.status}`);
    });
}
export function employeeLogin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        console.log(res);
        if (!res.ok)
            throw new Error(`Fehler beim Login: ${res.status}`);
        const data = yield res.json();
        return data.success;
    });
}
