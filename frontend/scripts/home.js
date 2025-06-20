function getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); 
}

window.onload = function () {
    const user = getUserFromToken();
    const justLoggedIn = localStorage.getItem('justLoggedIn');

    if (user) {
        document.getElementById('welcomeMessage').innerText =
            `Welcome back, ${user.name || user.email || "Student"}`;

        if (justLoggedIn === 'true') {
            var myModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
            myModal.show();
            localStorage.removeItem('justLoggedIn');  
        }
    } else {
        window.location.href = 'login.html';
    }
};
