// reset-password.js

document.querySelector('button').addEventListener('click', async function () {
    const password = document.querySelector('input[type="password"]').value;
    const confirmPassword = document.querySelector('input[type="password"]:nth-child(2)').value;

    // 验证密码是否匹配
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // 验证密码长度
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    // 获取查询参数（token）
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // 从 URL 中获取 token

    if (!token) {
        alert("Invalid or expired token.");
        return;
    }

    // 发送 PUT 请求到后端的重置密码接口
    const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }) // 发送新密码和 token
    });

    const data = await response.json();

    if (response.status === 200) {
        // 重置密码成功，跳转到成功页面
        window.location.href = 'reset-password-success.html';
    } else {
        // 失败，显示错误信息
        alert('Failed to reset password: ' + data.message);
    }
});
