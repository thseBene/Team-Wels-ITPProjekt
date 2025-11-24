const submitButton = document.getElementById("submitButton");
const feedbackContainer = document.getElementById("feedbackContainer") as HTMLFormElement;
const descriptionField = document.getElementById("descriptionField") as HTMLTextAreaElement;
const headerField = document.getElementById("headerField") as HTMLInputElement;
const directorFigure = document.getElementById("directorFigure") as HTMLDivElement;
const messageContact = document.getElementById("messageContact") as HTMLDivElement;
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


// send contact info to server
async function sendContactInfo(feedback: {subject: string; description: string; type: string;}) {

  console.log("Sende Kontaktinfo...");
  const errorMessageContact = document.getElementById("errorMessageContact");

  const contactField = document.getElementById("inputContact") as HTMLInputElement;
  const contactInfo = contactField.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = contactInfo.replace(/\D/g, '');
  const isEmail = emailRegex.test(contactInfo);
  const isPhone = digitsOnly.length >= 7 && digitsOnly.length <= 15;


  let telefon = false;
  let email = false;

  // empty is allowed (optional), otherwise require valid email or phone
  if (contactInfo && !isEmail && !isPhone) {

    if (errorMessageContact) {
      errorMessageContact.textContent = "Bitte gültige E‑Mail-Adresse oder Telefonnummer eingeben.";
      errorMessageContact.style.display = "block";
    }
    return; 
  }
  errorMessageContact!.style.display = "none";

  const contactType = isEmail ? "mail" : isPhone ? "tel" : "unknown";
  
  console.log("Kontaktinfo Typ:", contactType);


  contactInfo.replace(/\s+/g, '');
  let userId: number | null = null;

  
  // optional: send contact info to server
  try {
    const normalized = contactInfo.replace(/\s+/g, '');
    const payload: Record<string, string | null> = {};
    if (contactType === "mail") {
      payload.mail = normalized;
      payload.tel = null;
    } else if (contactType === "tel") {
      payload.mail = null;
      payload.tel = normalized;
    }
    console.log(payload);


    const response = await fetch("http://localhost:8080/api/benutzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Fehler beim Senden der Kontaktinfo:", response.statusText);
    } else {
      try {
        const created = await response.json(); // falls Backend die Entity im Body zurückgibt
          console.log("Benutzer erstellt (body):", created);
          if (created && typeof created.id !== "undefined") {
            userId = Number(created.id);
          }

          setTimeout(() => {
          }, 5000);
        
      }catch (error) {
        console.log("Error beim Parsen der Antwort:", error);

      }
    }
  } catch (error) {
    console.error("Netzwerkfehler beim Senden der Kontaktinfo:", error);
  }

  // falls die zuvor empfangene id als globale Variable (z.B. window.id) verfügbar ist, an das Feedback anhängen


try {
  const feedbackPayload: any = {
        subject: feedback.subject,
        description: feedback.description,
        type: feedback.type,
        status: "Neu"
      };
      if (userId != null) {
        feedbackPayload.userId = userId;
      }
    const fbResp = await fetch("http://localhost:8080/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackPayload)
    });

    if (!fbResp.ok) {
      console.error("Fehler beim Senden des Feedbacks:", fbResp.status, await fbResp.text());
      return;
    }

    const createdFeedback = await fbResp.json().catch(() => null);
    console.log("Feedback erfolgreich gesendet. userId=", userId, "createdFeedback=", createdFeedback);
  } catch (err) {
    console.error("Netzwerkfehler beim Senden des Feedbacks:", err);
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

  

  document.getElementById("gridContainer")!.style.display = "none";

  messageContact.innerHTML = `
      <div id="contactContainer">
          <div id="profile">
                  <svg width="155" height="155" viewBox="0 0 155 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_343_30)">
                      <rect width="155" height="155" rx="77.5" fill="white"/>
                      <path d="M85.7453 54.4083C90.0192 54.357 94.7969 54.0397 99.9667 53.2559C102.85 52.8219 105.561 52.2854 108.085 51.6928C108.388 54.0304 108.794 56.4799 109.336 59.0275C110.801 65.9702 115.355 77.2895 115.891 77.2895C117.086 73.5428 121.131 72.9782 121.131 72.9782C129.142 73.3422 129.039 82.8651 129.039 82.8651C128.209 92.6493 118.859 93.2139 118.859 93.2139V98.9902C118.597 100.758 119.022 106.437 110.992 113.184C102.957 119.926 85.5166 119.38 85.5166 119.38L85.6893 119.478C85.6893 119.478 68.2485 120.024 60.2139 113.282C52.1794 106.539 51.8668 101.02 51.6102 99.2514V92.9013C51.6102 92.9013 42.9971 92.7473 42.1666 82.9631C42.1666 82.9631 42.0639 73.4402 50.0751 73.0762C50.0751 73.0762 53.2992 73.4402 54.4983 77.1868H56.1127L60.7972 54.6556C69.0183 54.6043 77.2395 54.553 85.4607 54.5016" fill="#FEAD84"/>
                      <path d="M50.0703 73.0809C50.0703 73.0809 48.2086 60.5345 49.9256 54.7582C49.9256 54.7582 48.9878 55.5374 46.8042 53.979C46.8042 53.979 47.1168 47.1903 57.265 40.6348C57.265 40.6348 74.9017 27.5239 102.845 38.1386C102.845 38.1386 108.622 40.7934 110.651 45.7858C110.651 45.7858 118.298 45.1606 120.799 54.8375C120.799 54.8375 121.579 59.8346 121.425 64.827C121.271 69.8241 121.308 72.1617 120.818 72.8289C120.207 72.9875 119.33 73.3001 118.429 73.9487C116.833 75.1012 116.152 76.6129 115.891 77.2987C114.244 73.8834 112.555 69.8148 111.108 65.135C109.573 60.1752 108.65 55.6214 108.085 51.6974C108.085 51.6974 97.5029 54.3429 85.7171 54.3429C73.9312 54.3429 60.6617 54.6556 60.6617 54.6556L56.0565 77.1354H54.4935C54.4935 77.1354 53.6396 73.7154 50.0656 73.0855L50.0703 73.0809Z" fill="#5A3A28" stroke="#5A3A28" stroke-width="2" stroke-miterlimit="10"/>
                      <path d="M43.3562 167.307L45.9317 146.395L46.543 147.44L45.2925 167.265" fill="#092541"/>
                      <path d="M127.77 167.116L125.199 146.199L124.583 147.249L125.833 167.074" fill="#092541"/>
                      <path d="M77.1879 126.383C77.1879 126.383 78.1491 130.442 80.468 131.068C80.468 131.068 75.1863 148.238 76.1474 149.801C77.1086 151.364 83.5661 167.167 83.5661 167.167L87.616 167.069L94.876 150.267C94.6427 148.424 94.3394 146.511 93.9522 144.524C93.0143 139.727 91.7546 135.411 90.3968 131.614C91.092 130.988 92.0858 129.938 92.8324 128.394C93.2989 127.433 93.5462 126.542 93.6769 125.837L85.647 119.842L77.1879 126.383Z" fill="#083055"/>
                      <path d="M85.395 131.058C85.9696 131.058 86.4354 130.592 86.4354 130.018C86.4354 129.443 85.9696 128.977 85.395 128.977C84.8203 128.977 84.3545 129.443 84.3545 130.018C84.3545 130.592 84.8203 131.058 85.395 131.058Z" fill="#E0EAED"/>
                      <path d="M82.2502 127.829C82.8248 127.829 83.2907 127.364 83.2907 126.789C83.2907 126.214 82.8248 125.749 82.2502 125.749C81.6756 125.749 81.2097 126.214 81.2097 126.789C81.2097 127.364 81.6756 127.829 82.2502 127.829Z" fill="#E0EAED"/>
                      <path d="M85.3205 124.517C85.8951 124.517 86.361 124.051 86.361 123.476C86.361 122.902 85.8951 122.436 85.3205 122.436C84.7459 122.436 84.28 122.902 84.28 123.476C84.28 124.051 84.7459 124.517 85.3205 124.517Z" fill="#E0EAED"/>
                      <path d="M88.675 127.676C89.2496 127.676 89.7155 127.21 89.7155 126.635C89.7155 126.061 89.2496 125.595 88.675 125.595C88.1004 125.595 87.6345 126.061 87.6345 126.635C87.6345 127.21 88.1004 127.676 88.675 127.676Z" fill="#E0EAED"/>
                      <path d="M88.5446 135.118C89.1193 135.118 89.5851 134.652 89.5851 134.077C89.5851 133.502 89.1193 133.037 88.5446 133.037C87.97 133.037 87.5042 133.502 87.5042 134.077C87.5042 134.652 87.97 135.118 88.5446 135.118Z" fill="#E0EAED"/>
                      <path d="M82.1945 135.118C82.7692 135.118 83.235 134.652 83.235 134.077C83.235 133.502 82.7692 133.037 82.1945 133.037C81.6199 133.037 81.1541 133.502 81.1541 134.077C81.1541 134.652 81.6199 135.118 82.1945 135.118Z" fill="#E0EAED"/>
                      <path d="M85.4233 138.496C85.9979 138.496 86.4638 138.03 86.4638 137.455C86.4638 136.881 85.9979 136.415 85.4233 136.415C84.8487 136.415 84.3828 136.881 84.3828 137.455C84.3828 138.03 84.8487 138.496 85.4233 138.496Z" fill="#E0EAED"/>
                      <path d="M88.6474 141.827C89.222 141.827 89.6879 141.361 89.6879 140.787C89.6879 140.212 89.222 139.746 88.6474 139.746C88.0728 139.746 87.6069 140.212 87.6069 140.787C87.6069 141.361 88.0728 141.827 88.6474 141.827Z" fill="#E0EAED"/>
                      <path d="M82.2739 141.878C82.8485 141.878 83.3144 141.412 83.3144 140.838C83.3144 140.263 82.8485 139.797 82.2739 139.797C81.6992 139.797 81.2334 140.263 81.2334 140.838C81.2334 141.412 81.6992 141.878 82.2739 141.878Z" fill="#E0EAED"/>
                      <path d="M79.2548 138.444C79.8295 138.444 80.2953 137.979 80.2953 137.404C80.2953 136.829 79.8295 136.363 79.2548 136.363C78.6802 136.363 78.2144 136.829 78.2144 137.404C78.2144 137.979 78.6802 138.444 79.2548 138.444Z" fill="#E0EAED"/>
                      <path d="M79.1242 145.312C79.6989 145.312 80.1647 144.846 80.1647 144.272C80.1647 143.697 79.6989 143.231 79.1242 143.231C78.5496 143.231 78.0837 143.697 78.0837 144.272C78.0837 144.846 78.5496 145.312 79.1242 145.312Z" fill="#E0EAED"/>
                      <path d="M85.4462 145.261C86.0209 145.261 86.4867 144.795 86.4867 144.221C86.4867 143.646 86.0209 143.18 85.4462 143.18C84.8716 143.18 84.4058 143.646 84.4058 144.221C84.4058 144.795 84.8716 145.261 85.4462 145.261Z" fill="#E0EAED"/>
                      <path d="M91.7453 145.312C92.3199 145.312 92.7858 144.846 92.7858 144.272C92.7858 143.697 92.3199 143.231 91.7453 143.231C91.1707 143.231 90.7048 143.697 90.7048 144.272C90.7048 144.846 91.1707 145.312 91.7453 145.312Z" fill="#E0EAED"/>
                      <path d="M82.2502 148.644C82.8248 148.644 83.2907 148.178 83.2907 147.603C83.2907 147.029 82.8248 146.563 82.2502 146.563C81.6756 146.563 81.2097 147.029 81.2097 147.603C81.2097 148.178 81.6756 148.644 82.2502 148.644Z" fill="#E0EAED"/>
                      <path d="M88.5959 148.592C89.1705 148.592 89.6364 148.127 89.6364 147.552C89.6364 146.977 89.1705 146.511 88.5959 146.511C88.0213 146.511 87.5554 146.977 87.5554 147.552C87.5554 148.127 88.0213 148.592 88.5959 148.592Z" fill="#E0EAED"/>
                      <path d="M79.0498 152.026C79.6244 152.026 80.0902 151.56 80.0902 150.986C80.0902 150.411 79.6244 149.945 79.0498 149.945C78.4751 149.945 78.0093 150.411 78.0093 150.986C78.0093 151.56 78.4751 152.026 79.0498 152.026Z" fill="#E0EAED"/>
                      <path d="M85.395 152.026C85.9696 152.026 86.4354 151.56 86.4354 150.986C86.4354 150.411 85.9696 149.945 85.395 149.945C84.8203 149.945 84.3545 150.411 84.3545 150.986C84.3545 151.56 84.8203 152.026 85.395 152.026Z" fill="#E0EAED"/>
                      <path d="M91.7453 151.924C92.3199 151.924 92.7858 151.458 92.7858 150.883C92.7858 150.309 92.3199 149.843 91.7453 149.843C91.1707 149.843 90.7048 150.309 90.7048 150.883C90.7048 151.458 91.1707 151.924 91.7453 151.924Z" fill="#E0EAED"/>
                      <path d="M82.2739 155.409C82.8485 155.409 83.3144 154.943 83.3144 154.369C83.3144 153.794 82.8485 153.328 82.2739 153.328C81.6992 153.328 81.2334 153.794 81.2334 154.369C81.2334 154.943 81.6992 155.409 82.2739 155.409Z" fill="#E0EAED"/>
                      <path d="M88.5678 155.358C89.1425 155.358 89.6083 154.892 89.6083 154.317C89.6083 153.743 89.1425 153.277 88.5678 153.277C87.9932 153.277 87.5273 153.743 87.5273 154.317C87.5273 154.892 87.9932 155.358 88.5678 155.358Z" fill="#E0EAED"/>
                      <path d="M24.4736 166.962L29.2748 143.432C29.2748 143.432 33.6046 132.542 35.4803 130.671C37.3559 128.8 39.9268 126.691 42.8569 124.815C45.7824 122.944 55.4313 116.226 55.4313 116.226C55.4313 116.226 52.2726 120.794 52.0346 122.198C51.7966 123.602 51.6567 123.929 51.8666 124.498C52.0766 125.067 57.6429 127.256 57.6429 127.256C57.6429 127.256 59.0986 127.671 58.2681 128.87C57.4376 130.069 54.7828 133.135 54.7828 133.135C54.7828 133.135 53.1684 134.124 55.3567 136.517C57.5403 138.911 80.3841 167.218 80.3841 167.218L45.4185 167.27L46.6689 147.445C46.6689 147.445 46.5663 146.978 45.8897 145.989L43.4962 167.06L43.4868 167.307L25.1782 167.4C25.1782 167.4 24.4736 167.475 24.4876 166.962H24.4736Z" fill="#0A2F55" stroke="#0A2F55" stroke-width="2" stroke-miterlimit="10"/>
                      <path d="M146.722 166.864L141.921 143.334C141.921 143.334 137.591 132.444 135.716 130.573C133.845 128.702 131.269 126.593 128.339 124.717C125.414 122.846 115.765 116.128 115.765 116.128C115.765 116.128 118.924 120.695 119.161 122.1C119.399 123.504 119.539 123.831 119.329 124.4C119.12 124.969 113.553 127.158 113.553 127.158C113.553 127.158 112.097 127.573 112.928 128.772C113.758 129.966 116.413 133.037 116.413 133.037C116.413 133.037 118.028 134.026 115.839 136.419C113.656 138.813 90.812 167.12 90.812 167.12L125.778 167.172L124.527 147.347C124.527 147.347 124.63 146.88 125.306 145.891L127.7 166.962L127.709 167.209L146.018 167.302C146.018 167.302 146.722 167.377 146.708 166.864H146.722Z" fill="#0A2F55" stroke="#0A2F55" stroke-width="2" stroke-miterlimit="10"/>
                      <path d="M68.7942 132.953L77.4026 126.383C77.4026 126.383 78.4151 130.596 80.6034 131.068C80.6034 131.068 75.219 147.379 76.3901 149.801L68.7942 132.957V132.953Z" fill="#F1E6D0"/>
                      <path d="M93.4808 125.837C93.4808 125.837 93.0888 129.663 90.28 131.614C90.28 131.614 94.8852 145.35 94.6519 150.268L102.402 132.855L93.4808 125.837Z" fill="#F1E6D0"/>
                      <path d="M85.6846 119.482C85.6846 119.482 81.1214 119.506 74.2533 118.829C67.3853 118.153 60.2092 113.282 60.2092 113.282L68.7943 132.948L85.6519 119.837L85.6846 119.478V119.482Z" fill="#FFF9EB"/>
                      <path d="M85.5117 119.384C85.5117 119.384 90.0749 119.408 96.943 118.731C103.811 118.055 110.987 113.184 110.987 113.184L102.402 132.85L85.5444 119.739L85.5117 119.38V119.384Z" fill="#FFF9EB"/>
                      <path d="M58.7019 112.297C58.7019 112.297 57.1669 114.117 56.3877 115.055C55.6085 115.992 54.2274 118.097 54.2274 118.097C51.2086 121.895 51.8618 124.493 51.8618 124.493C52.8043 125.259 53.6535 125.669 54.2507 125.898C54.9413 126.164 56.2057 126.546 57.6381 127.251C57.8994 127.377 58.4546 127.694 58.5246 128.114C58.5899 128.529 58.2633 128.865 58.2633 128.865C58.2633 128.865 55.5805 132.299 54.778 133.13C53.9755 133.96 54.54 135.575 54.54 135.575L80.3793 167.158H83.6267L60.2136 113.277C59.7377 112.885 59.1965 112.39 58.8606 112.078L58.7066 112.288L58.7019 112.297Z" fill="#0C3B6A" stroke="#0C3B6A" stroke-width="2" stroke-miterlimit="10"/>
                      <path d="M112.494 112.199C112.494 112.199 114.029 114.019 114.809 114.957C115.588 115.894 116.969 117.999 116.969 117.999C119.988 121.797 119.334 124.396 119.334 124.396C118.392 125.161 117.543 125.571 116.946 125.8C116.255 126.066 114.991 126.448 113.558 127.153C113.297 127.279 112.742 127.596 112.672 128.016C112.606 128.431 112.933 128.767 112.933 128.767C112.933 128.767 115.616 132.201 116.418 133.032C117.221 133.862 116.656 135.477 116.656 135.477L90.817 167.06H87.5696L110.983 113.179C111.459 112.787 112 112.292 112.336 111.98L112.49 112.19L112.494 112.199Z" fill="#0C3B6A" stroke="#0C3B6A" stroke-width="2" stroke-miterlimit="10"/>
                      <path d="M99.3671 99.3167C99.6657 98.2482 99.1898 97.1564 98.308 96.7271C97.6361 96.4005 96.8009 96.4985 96.1477 96.9604C95.4898 97.9029 93.8708 99.9512 90.9966 101.099C86.3308 102.961 82.1129 100.959 81.3944 100.604C81.3151 100.576 80.4799 100.282 79.7054 100.814C78.9262 101.346 78.8982 102.242 78.8982 102.321C78.8562 102.508 78.8515 102.681 78.8702 102.844C79.1595 105.088 84.6791 105.942 85.1924 106.017C87.39 106.054 93.5162 105.863 97.7061 101.463C98.364 100.772 98.9099 100.045 99.3624 99.3167H99.3671Z" fill="#D73438"/>
                      <path d="M88.092 77.2428C89.1838 80.6768 90.2756 84.1109 91.372 87.5449C91.4467 88.2401 91.4887 89.6072 90.7888 91.0583C90.4995 91.6508 90.1589 92.1174 89.851 92.4627C85.4978 94.5949 81.2239 93.8671 79.6655 91.5248C79.3996 91.1236 78.7137 89.9245 79.0823 87.7782C80.0574 84.3815 81.0326 80.9894 82.0077 77.5927C82.241 77.1261 82.6376 76.5522 83.2955 76.1883C84.6439 75.4418 86.5849 75.843 88.0966 77.2428H88.092Z" fill="#FA9569" stroke="#FA9569" stroke-miterlimit="10"/>
                      <path d="M62.5439 75.0307C62.5439 75.0307 62.6606 73.4957 63.9857 73.4583C65.3108 73.421 69.0201 73.421 69.0201 73.421C69.0201 73.421 70.1912 73.617 70.4245 74.4335C70.6578 75.25 70.5038 80.989 70.5038 80.989C70.5038 80.989 69.7246 84.1104 66.4446 83.9938C63.1645 83.8771 62.5439 81.2223 62.5439 81.2223V75.0307Z" fill="#132E4E"/>
                      <path d="M92.4563 75.0307C92.4563 75.0307 92.5729 73.4957 93.898 73.4583C95.2231 73.421 98.9325 73.421 98.9325 73.421C98.9325 73.421 100.104 73.617 100.337 74.4335C100.57 75.25 100.416 80.989 100.416 80.989C100.416 80.989 99.637 84.1104 96.3569 83.9938C93.0769 83.8771 92.4563 81.2223 92.4563 81.2223V75.0307Z" fill="#132E4E"/>
                      <path d="M115.83 77.4621V72.0591C115.676 71.4712 115.214 70.0342 113.861 68.835C112.849 67.9392 111.79 67.5799 111.206 67.4306C109.312 67.2253 107.334 67.062 105.276 66.9641C100.391 66.7261 95.8745 66.8707 91.8012 67.2253C91.2506 67.4213 90.4808 67.7712 89.7203 68.4198C88.2505 69.6749 87.756 71.2426 87.588 71.9052H85.6097L85.5583 75.1899H87.3967L88.2552 81.8247C88.2552 81.8247 89.1137 88.5388 94.3441 88.6927C94.3441 88.6927 105.589 89.7146 110.063 88.6927C114.538 87.6709 115.368 84.0316 115.368 84.0316C115.49 83.3784 115.597 82.6832 115.681 81.9506C115.867 80.3129 115.891 78.8059 115.83 77.4715V77.4621ZM112.662 81.9926C112.527 82.5572 112.289 83.1731 111.883 83.761C110.119 86.2992 106.625 86.2712 106.158 86.2572H97.6755C97.1249 86.3132 95.7018 86.3878 94.1901 85.5807C92.4404 84.6475 91.6986 83.1451 91.4839 82.6645C91.1667 81.5774 90.8774 80.3036 90.7047 78.8665C90.4108 76.4543 90.5321 74.3547 90.7561 72.7263C90.8167 72.4184 91.0034 71.6765 91.6426 71.0093C92.1698 70.4587 92.7484 70.2255 93.047 70.1228H109.699C109.947 70.1088 110.758 70.0902 111.519 70.6454C112.583 71.4199 112.657 72.6657 112.662 72.829V81.988V81.9926Z" fill="#0B3A69"/>
                      <path d="M55.5342 81.9461C55.6182 82.6786 55.7255 83.3738 55.8468 84.027C55.8468 84.027 56.6773 87.671 61.1518 88.6882C65.6263 89.71 76.8709 88.6882 76.8709 88.6882C82.1013 88.5342 82.9598 81.8201 82.9598 81.8201L83.8183 75.1853H85.6567L85.6053 71.9006H83.627C83.4591 71.238 82.9598 69.6703 81.4948 68.4152C80.7342 67.7667 79.9644 67.4121 79.4138 67.2208C75.3405 66.8662 70.824 66.7215 65.9389 66.9595C63.8766 67.0621 61.8983 67.2208 60.0087 67.4261C59.4301 67.5754 58.371 67.9346 57.3538 68.8305C55.9961 70.0296 55.5342 71.4713 55.3849 72.0545V77.4576C55.3242 78.792 55.3522 80.299 55.5342 81.9367V81.9461ZM58.553 72.8431C58.5623 72.6751 58.6369 71.4293 59.6961 70.6595C60.4566 70.1042 61.2685 70.1229 61.5157 70.1369H78.168C78.4666 70.2349 79.0452 70.4728 79.5724 71.0234C80.207 71.6906 80.3983 72.4325 80.4589 72.7404C80.6829 74.3688 80.8042 76.4684 80.5103 78.8806C80.3376 80.3177 80.0484 81.5915 79.7311 82.6786C79.5165 83.1592 78.7793 84.6616 77.0249 85.5947C75.5132 86.4019 74.0901 86.3273 73.5395 86.2713C70.7121 86.2713 67.8846 86.2713 65.0571 86.2713C64.5952 86.2806 61.0958 86.3133 59.3321 83.7751C58.9216 83.1872 58.6883 82.5713 58.553 82.0067C58.553 78.9553 58.553 75.9038 58.553 72.8477V72.8431Z" fill="#0B3A69"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_343_30">
                      <rect width="155" height="155" rx="77.5" fill="white"/>
                      </clipPath>
                      </defs>
                      </svg>

                      <h1 class="directorTItle">Bürgermeister</h1>

                      <p class="nowText">jetzt</p>


          </div>

          <p>Bürgermeistertext</p>

      </div>

      <div id="contactSection">
        <div id="inputContainer">
              <input type="text" id="inputContact" placeholder="E-Mail oder Telefonnummer (optional)"autocomplete="off" />
              <div id="noThanksButton" >Nein danke</div>
              <div id="submitContactButton" >Absenden</div>
            </div>
          <p id="errorMessageContact"></p>
      </div>
    




  `;


  document.getElementById("submitContactButton")?.addEventListener("click", () => sendContactInfo(feedback));
  document.getElementById("noThanksButton")?.addEventListener("click", () => sendOnlyFeedback(feedback));

 

}
async function sendOnlyFeedback(feedback: {subject: string; description: string; type: string;}) {
  try {
  const feedbackPayload: any = {
        subject: feedback.subject,
        description: feedback.description,
        type: feedback.type,
        status: "Neu"
      };
      
    const fbResp = await fetch("http://localhost:8080/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedbackPayload)
    });

    if (!fbResp.ok) {
      console.error("Fehler beim Senden des Feedbacks:", fbResp.status, await fbResp.text());
      return;
    }

    const createdFeedback = await fbResp.json().catch(() => null);
    console.log("Feedback erfolgreich gesendet. createdFeedback=", createdFeedback);
    window.location.href = "../index.html"
  } catch (err) {
    console.error("Netzwerkfehler beim Senden des Feedbacks:", err);
  }

}


