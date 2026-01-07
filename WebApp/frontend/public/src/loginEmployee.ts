document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    checkLoginData();
});


function checkLoginData() {

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    
    fetch('/api/employeeLogin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            redirectToDashboard();
        } else {
            alert('Invalid username or password. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function redirectToDashboard() {
    window.location.href = "./employeeDashboard.html";

}