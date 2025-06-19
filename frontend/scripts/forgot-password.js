async function sendResetLink() {
  const email = document.getElementById('email').value;

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  const res = await fetch('http://localhost:3000/api/request-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await res.json();
  if (res.status === 200) {
    alert(data.message + "\n\n(Simulation: Please see the reset link in the console)");
  } else {
    alert(data.message || 'Failed to send reset link.');
  }
}
