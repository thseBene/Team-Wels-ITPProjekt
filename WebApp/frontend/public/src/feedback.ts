const submitButton = document.getElementById("submitFeedbackButton");
const feedbackContainer = document.getElementById("feedbackContainer");
const descriptionField = document.getElementById("descriptionField") as HTMLTextAreaElement;
const headerField = document.getElementById("headerField") as HTMLInputElement;

setAtBeginning();




// to store the uploaded images
let savedImages = new Array<File>();
if (submitButton && descriptionField && headerField) {
  submitButton.addEventListener("click", () => {
    const feedback = {
      betreff: headerField.value,
      description: descriptionField.value,
      images: savedImages
    };
    
    feedbackContainer!.innerHTML = "";
    feedbackContainer!.innerHTML = "<h2 id='thankYouMessage'>Vielen Dank für Ihr Feedback!</h2>";

    sendFeedback(feedback.description, feedback.betreff);
    // Hier müssen dann die Daten an die Datenbank gesendet werden

  });
}

const uploadForm = document.getElementById("uploadForm") as HTMLFormElement;
const imageInput = document.getElementById("imageInput") as HTMLInputElement;
const imagePreview = document.getElementById("imagePreview") as HTMLDivElement;

// handle image selection and preview
imageInput.addEventListener("change", () => {
  if (!imageInput.files) {
    console.log('Keine Dateien ausgewählt');
    imagePreview.style.display = "none";
    return;
  }

  imagePreview.style = 'display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;';

  const files = Array.from(imageInput.files!);
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
    div.appendChild(i)
    imagePreview.appendChild(div);
  }
});

// delete image from preview and savedImages array
imagePreview.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("remove-image")) {
    const previewDiv = target.closest(".preview-image");
    previewDiv?.remove();
    savedImages.splice(Array.from(imagePreview.children).indexOf(previewDiv!), 1);
    console.log('Verbleibende Bilder:', savedImages);
    if (savedImages.length === 0) {
      imagePreview.style.display = "none";
    }

  }
});

// handle form submission
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


// sets the caret at the beginning of the description field when focused or clicked
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
sendFeedback("Hallo", "Test");


// send Feedback to Server
async function sendFeedback(description: string, betreff: string) {

  const feedback = {
    subject: betreff, 
    description: description,
    type: "Beschwerde"
  };

  console.log("Sende Feedback:", feedback);
  const response = await fetch("http://localhost:8080/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(feedback)
  });

  if (!response.ok) {
    console.error("Fehler beim Senden:", response.statusText);
    return;
  }
  console.log("Feedback erfolgreich gesendet");
}
