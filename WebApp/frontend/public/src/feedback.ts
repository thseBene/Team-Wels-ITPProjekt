
const submitButton = document.getElementById("submitFeedbackButton");
const feedbackContainer = document.getElementById("feedbackContainer");
const descriptionField = document.getElementById("descriptionField") as HTMLTextAreaElement;

if (submitButton && descriptionField) {
  submitButton.addEventListener("click", () => {
    const feedback = {
      description: descriptionField.value
    };
    console.log("Feedback submitted:", feedback);
    
    feedbackContainer!.innerHTML = "";
    feedbackContainer!.innerHTML = "<h2 id='thankYouMessage'>Vielen Dank für Ihr Feedback!</h2>";

    // Hier müssen dann die Daten an die Datenbank gesendet werden

  });
}

const uploadForm = document.getElementById("uploadForm") as HTMLFormElement;
const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const imagePreview = document.getElementById("imagePreview") as HTMLDivElement;

imageInput.addEventListener("change", () => {
  if (!imageInput.files) {
    console.log('Keine Dateien ausgewählt');
    imagePreview.style.display = "none";
    return;
  }

  imagePreview.style = 'display: grid;         grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;';
  console.log('Dateien sind ausgewählt:', imageInput.files);

  const files = Array.from(imageInput.files!);

  for (const file of files) {
    const img = document.createElement("img");
    const div = document.createElement("div");
    const i = document.createElement("i");
    i.classList.add("fa-solid", "fa-circle-xmark");
    div.classList.add("preview-image");
    i.classList.add("remove-image");
    
    img.src = URL.createObjectURL(file);
    div.appendChild(img);
    div.appendChild(i)
    imagePreview.appendChild(div);
  }
});


uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!imageInput.files?.length) {
    alert("Bitte mindestens ein Bild auswählen!");
    return;
  }
  const files = Array.from(imageInput.files!);

  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }

  
});

setAtBeginning();

function setAtBeginning() {
    // remove accidental leading newlines from HTML formatting
    descriptionField.value = descriptionField.value.replace(/^\n+/, '');

    let initialized = false;

    const moveCaretToStart = () => {
        if (initialized) return; // only run once
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
