document.getElementById('update-password-btn').addEventListener('click', async function () {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        alert("Invalid or expired token.");
        return;
    }

    const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token })
    });

    const data = await response.json();

    if (response.status === 200) {
        window.location.href = 'reset-password-success.html';
    } else {
        alert('Failed to reset password: ' + data.message);
    }
});
