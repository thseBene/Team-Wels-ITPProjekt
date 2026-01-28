import { employeeLogin } from "./api/feedback-api.js";


document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    checkLoginData();
});


function checkLoginData() {

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    
    employeeLogin(username, password)
        .then(() => {
            redirectToDashboard();
        })
        .catch((error) => {
            alert("Login fehlgeschlagen: " + error.message);
        });

        
}

function redirectToDashboard() {
    window.location.href = "./employeeDashboard.html";

}