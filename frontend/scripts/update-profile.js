// update-profile.js

document.querySelector('a.btn').addEventListener('click', async function () {
    const token = localStorage.getItem('token');  // 获取存储的 token

    if (!token) {
        window.location.href = 'login.html';  // 如果没有 token，重定向到登录页面
        return;
    }

    const fullName = document.querySelector('#fullName').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const cgpa = document.querySelector('#cgpa').value;

    // 发送 PUT 请求更新用户资料
    const response = await fetch('http://localhost:3000/api/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // 传递 token
        },
        body: JSON.stringify({ fullName, email, password, cgpa })
    });

    const data = await response.json();

    if (response.status === 200) {
        alert('Profile updated successfully!');
        window.location.href = 'profile.html';  // 成功后返回 profile 页面
    } else {
        alert('Failed to update profile: ' + data.message);
    }
});
