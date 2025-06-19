// profile.js

document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');  // 获取存储的 token

    if (!token) {
        window.location.href = 'login.html';  // 如果没有 token，重定向到登录页面
        return;
    }

    // 发送 GET 请求获取用户资料
    const response = await fetch('http://localhost:3000/api/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // 通过 Authorization 头部传递 token
        }
    });

    const data = await response.json();

    if (response.status === 200) {
        // 在页面中显示用户资料
        document.querySelector('#username').value = data.name;
        document.querySelector('#email').value = data.email;
        document.querySelector('#cgpa').value = data.cgpa || 'N/A';
    } else {
        alert('Failed to fetch user profile: ' + data.message);
    }
    // 额外获取评论数据并渲染评论卡片
    const commentRes = await fetch('http://localhost:3000/api/comments/mine', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const commentData = await commentRes.json();

    if (commentRes.status === 200 && Array.isArray(commentData)) {
        const commentsTab = document.querySelector('#commentsTab');
        const addCommentBtn = commentsTab.querySelector('a.btn');
        commentsTab.innerHTML = '<h4 class="text-primary-blue">My Comments</h4>'; // 清空内容保留标题

        if (commentData.length === 0) {
            commentsTab.innerHTML += '<p>No comments posted yet.</p>';
        } else {
            commentData.forEach(comment => {
                const card = document.createElement('div');
                card.className = "col";
                card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${comment.title || 'Untitled Comment'}</h5>
                    <p class="card-text">${comment.content}</p>
                    <p class="text-muted small">Posted on ${new Date(comment.createdAt).toLocaleString()}</p>
                </div>
            `;
                commentsTab.appendChild(card);
            });
        }

        // 再把“Add Comment”按钮放回来
        commentsTab.appendChild(addCommentBtn);
    } else {
        console.error('Failed to load comments:', commentData.message || commentData);
    }

});

// 绑定删除账号按钮
const deleteBtn = document.getElementById('deleteAccountBtn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', async function () {
        if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("No token found. Please login again.");
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:3000/api/profile', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            alert("Your account has been deleted.");
            localStorage.removeItem('token');
            window.location.href = 'create-account.html';
        } else {
            alert("Failed to delete account: " + data.message);
        }
    });
}
