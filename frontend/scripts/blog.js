document.addEventListener("DOMContentLoaded", async function () {
    const listContainer = document.getElementById("commentList");
    const token = localStorage.getItem("token");
    let currentUserId = null;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserId = payload.id || payload._id;
        } catch (err) {
            console.warn("Invalid token");
        }
    }

    try {
        const res = await fetch("http://localhost:3000/api/comments");
        const comments = await res.json();

        comments.forEach(comment => {
            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";

            const author = comment.userId?.name || "Unknown";
            const time = new Date(comment.createdAt).toLocaleString();

            card.innerHTML = `
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${comment.title}</h5>
      <p class="card-text">${comment.content}</p>
      <p class="mt-auto text-muted small">Posted by <strong>${author}</strong> on ${time}</p>
      ${comment.userId?._id === currentUserId ? `
        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-warning btn-sm w-100" onclick="editComment('${comment._id}', '${escapeHtml(comment.title)}', '${escapeHtml(comment.content)}')">Edit</button>
          <button class="btn btn-danger btn-sm w-100" onclick="deleteComment('${comment._id}')">Delete</button>
        </div>
      ` : ''}
    </div>
  </div>
`;

            listContainer.appendChild(card);


        });
    } catch (err) {
        console.error("Failed to load comments:", err);
    }
});

// Delete Comment
async function deleteComment(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to delete comments.");
        return;
    }

    if (confirm("Are you sure you want to delete this comment?")) {
        try {
            const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const errData = await res.json();
                alert("Failed to delete: " + errData.error);
            }
        } catch (err) {
            alert("Error deleting comment.");
            console.error(err);
        }
    }
}

// Edit Comment
async function editComment(id, oldTitle, oldContent) {

    const newTitle = prompt("Edit Title:", oldTitle);
    if (newTitle === null) return; 
    const newContent = prompt("Edit Content:", oldContent);
    if (newContent === null) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to edit comments.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title: newTitle, content: newContent })
        });

        if (res.ok) {
            alert("Comment updated successfully!");
            window.location.reload();
        } else {
            const err = await res.json();
            alert("Failed to update comment: " + err.error);
        }
    } catch (err) {
        alert("Network error. Please try again.");
        console.error(err);
    }
}


function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}
