document.addEventListener("DOMContentLoaded", async function () {
    const listContainer = document.getElementById("commentList");
    const token = localStorage.getItem("token");
    let currentUserId = null;

    // 解析当前登录用户 ID
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
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${comment.title}</h5>
                        <p class="card-text">${comment.content}</p>
                        <p class="card-text"><small class="text-muted">Posted by <strong>${author}</strong> on ${time}</small></p>
                        ${comment.userId?._id === currentUserId ? `
                            <button class="btn btn-sm btn-warning" onclick="editComment('${comment._id}', '${escapeHtml(comment.title)}', '${escapeHtml(comment.content)}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteComment('${comment._id}')">Delete</button>
                        ` : ''}
                    </div>
                </div>`;
            listContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load comments:", err);
    }
});

// 删除评论
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

// 编辑评论 - 弹窗版
async function editComment(id, oldTitle, oldContent) {
    // 简单弹窗编辑，可以用更好的 Modal 替代
    const newTitle = prompt("Edit Title:", oldTitle);
    if (newTitle === null) return; // 用户取消
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

// 简单防止 HTML 注入的转义函数
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
