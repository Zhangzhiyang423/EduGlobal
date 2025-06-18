document.getElementById("commentForm").onsubmit = async function (event) {
    event.preventDefault();

    const title = document.getElementById("commentTitle").value.trim();
    const content = document.getElementById("commentBody").value.trim();
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must log in first.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })  // ✅ 不再传 userId
        });

        if (response.ok) {
            window.location.href = "add-comment-done.html";
        } else {
            const err = await response.json();
            alert("Failed to post: " + err.error);
        }
    } catch (err) {
        alert("Server/network error");
        console.error(err);
    }
};
