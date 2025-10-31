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
const submitButton = document.getElementById("submitFeedbackButton");
const feedbackContainer = document.getElementById("feedbackContainer");
const descriptionField = document.getElementById("descriptionField");
let savedImages = new Array();
if (submitButton && descriptionField) {
    submitButton.addEventListener("click", () => {
        const feedback = {
            description: descriptionField.value,
            images: savedImages
        };
        console.log("Feedback submitted:", feedback);
        feedbackContainer.innerHTML = "";
        feedbackContainer.innerHTML = "<h2 id='thankYouMessage'>Vielen Dank für Ihr Feedback!</h2>";
        // Hier müssen dann die Daten an die Datenbank gesendet werden
    });
}
const uploadForm = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
imageInput.addEventListener("change", () => {
    if (!imageInput.files) {
        console.log('Keine Dateien ausgewählt');
        imagePreview.style.display = "none";
        return;
    }
    imagePreview.style = 'display: grid;         grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;';
    const files = Array.from(imageInput.files);
    files.forEach(file => savedImages.push(file));
    console.log('Dateien sind ausgewählt:', savedImages);
    for (const file of files) {
        const img = document.createElement("img");
        const div = document.createElement("div");
        const i = document.createElement("i");
        i.classList.add("fa-solid", "fa-circle-xmark");
        div.classList.add("preview-image");
        i.classList.add("remove-image");
        img.src = URL.createObjectURL(file);
        div.appendChild(img);
        div.appendChild(i);
        imagePreview.appendChild(div);
    }
});
imagePreview.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("remove-image")) {
        const previewDiv = target.closest(".preview-image");
        previewDiv === null || previewDiv === void 0 ? void 0 : previewDiv.remove();
        savedImages.splice(Array.from(imagePreview.children).indexOf(previewDiv), 1);
        console.log('Verbleibende Bilder:', savedImages);
        if (savedImages.length === 0) {
            imagePreview.style.display = "none";
        }
    }
});
uploadForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    e.preventDefault();
    if (!((_a = imageInput.files) === null || _a === void 0 ? void 0 : _a.length)) {
        alert("Bitte mindestens ein Bild auswählen!");
        return;
    }
    const files = Array.from(imageInput.files);
    const formData = new FormData();
    for (const file of files) {
        formData.append("images", file);
    }
}));
setAtBeginning();
function setAtBeginning() {
    // remove accidental leading newlines from HTML formatting
    descriptionField.value = descriptionField.value.replace(/^\n+/, '');
    let initialized = false;
    const moveCaretToStart = () => {
        if (initialized)
            return; // only run once
        // schedule after browser's default click/focus handling so our caret position wins
        setTimeout(() => {
            descriptionField.focus();
            descriptionField.setSelectionRange(0, 0);
        }, 0);
        initialized = true;
        descriptionField.removeEventListener('focus', moveCaretToStart);
        descriptionField.removeEventListener('click', moveCaretToStart);
    };
    descriptionField.addEventListener('focus', moveCaretToStart);
    descriptionField.addEventListener('click', moveCaretToStart);
}
