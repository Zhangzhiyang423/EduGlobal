window.addEventListener('DOMContentLoaded', (event) => {
    const loginButton = document.querySelector('button');  
    console.log(loginButton);  

    if (loginButton) {
        loginButton.addEventListener('click', async function (event) {
            event.preventDefault();  

            console.log("Login button clicked");  

            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;

            if (!email || !password) {
                alert("Please enter both email and password");
                return;
            }

            console.log("Sending request to backend");

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })  
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.status === 200) {
                localStorage.setItem('token', data.token);  
                localStorage.setItem('justLoggedIn', 'true');
                console.log('Login successful, redirecting...');
                window.location.href = 'home.html';  
            } else {
                alert('Login failed: ' + data.message);  
            }
        });
    } else {
        console.log("Login button not found!");
    }
});
