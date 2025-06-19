document.getElementById('change-password-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const oldPassword = document.getElementById('old-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Please login first.");
    window.location.href = 'login.html';
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    const data = await res.json();

    if (res.status === 200) {
      alert("Password changed successfully!");
      window.location.href = 'profile.html';
    } else {
      alert("Failed to change password: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Error changing password.");
  }
});
