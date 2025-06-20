document.querySelector('#updateProfileForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,         
            email,
        })
    });

    const data = await response.json();

    if (response.status === 200) {
        alert('Profile updated successfully!');
        window.location.href = 'profile.html';
    } else {
        alert('Failed to update profile: ' + data.message);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = 'login.html');

    const res = await fetch('http://localhost:3000/api/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();
    if (res.status === 200) {
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
    }
});
