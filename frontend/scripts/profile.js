// profile.js

document.addEventListener('DOMContentLoaded', async function() {
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
});
