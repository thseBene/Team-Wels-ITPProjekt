const submitButton = document.getElementById("submitButton");
const feedbackContainer = document.getElementById("feedbackContainer") as HTMLFormElement;
const descriptionField = document.getElementById("descriptionField") as HTMLTextAreaElement;
const headerField = document.getElementById("headerField") as HTMLInputElement;
const directorFigure = document.getElementById("directorFigure") as HTMLDivElement;

setAtBeginning();




// to store the uploaded images
let savedImages = new Array<File>();


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
 feedbackContainer.innerHTML = `<div id="thankYouMessage" class="bubble">
    <h2 id="thankYouMessageHeader">Vielen Dank für dein Feedback!</h2>
    <p>Möchtest du über den Bearbeitungsstatus deines Anliegen am Laufenden bleiben?</p>
    <input type="text" id="emailTelefonField" placeholder="E-Mail oder Telefonnummer (optional)" />
    <p id="errorMessageContact"></p>
    <div id="buttonGrid">
      <button id="saveContactButton" class="save">Nein danke</button>
      <button id="submitContactButton"class="submit">Absenden</button>
    </div>

</div>
`;

document.getElementById("submitContactButton")?.addEventListener("click", sendContactInfo);

async function sendContactInfo() {
  const errorMessageContact = document.getElementById("errorMessageContact");

  const contactField = document.getElementById("emailTelefonField") as HTMLInputElement;
  const contactInfo = contactField.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = contactInfo.replace(/\D/g, '');
  const isEmail = emailRegex.test(contactInfo);
  const isPhone = digitsOnly.length >= 7 && digitsOnly.length <= 15;


  // empty is allowed (optional), otherwise require valid email or phone
  if (contactInfo && !isEmail && !isPhone) {

    if (errorMessageContact) {
      errorMessageContact.textContent = "Bitte gültige E‑Mail-Adresse oder Telefonnummer eingeben.";
      errorMessageContact.style.display = "block";
    }
    return; 
  }
  errorMessageContact!.style.display = "none";

  contactInfo.replace(/\s+/g, '');
  
  // optional: send contact info to server
  try {
    const response = await fetch("http://localhost:8080/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: contactInfo })
    });
    if (!response.ok) {
      console.error("Fehler beim Senden der Kontaktinfo:", response.statusText);
    } else {
      console.log("Kontaktinfo erfolgreich gesendet");
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Senden der Kontaktinfo:", error);
  }
}



// send Feedback to Server
feedbackContainer.addEventListener("submit", sendFeedback);

async function sendFeedback(event: Event)
 {
  event.preventDefault();
  const betreff = headerField.value;
  const description = descriptionField.value; 
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
