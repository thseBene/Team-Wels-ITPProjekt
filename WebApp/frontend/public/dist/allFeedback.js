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
function getAllFeedback() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:8080/api/feedback", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen: ${response.status}`);
        }
        const feedbackList = yield response.json();
        console.log("Feedbacks:", feedbackList);
    });
}
getAllFeedback();
