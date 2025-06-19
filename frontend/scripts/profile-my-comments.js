document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("myCommentsList");
    const token = localStorage.getItem("token");

    if (!token) {
        container.innerHTML = "<p class='text-danger'>You must be logged in to view your comments.</p>";
        return;
    }

    let currentUserId = null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.id || payload._id;
    } catch (err) {
        console.warn("Invalid token");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/comments");
        const comments = await res.json();

        const myComments = comments.filter(c => c.userId?._id === currentUserId);

        if (myComments.length === 0) {
            container.innerHTML = "<p class='text-muted'>You haven't posted any comments yet.</p>";
            return;
        }

        myComments.forEach(comment => {
            const card = document.createElement("div");
            card.className = "col"; // 让 Bootstrap 网格起作用

            const time = new Date(comment.createdAt).toLocaleString();

            card.innerHTML = `
    <div class="card h-100 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">${comment.title}</h5>
        <p class="card-text">${comment.content}</p>
      </div>
      <div class="card-footer bg-white border-0">
        <small class="text-muted">Posted on ${time}</small>
      </div>
    </div>
  `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Failed to load comments:", err);
        container.innerHTML = "<p class='text-danger'>Failed to load your comments.</p>";
    }
});
