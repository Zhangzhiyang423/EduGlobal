// login.js

document.querySelector('button').addEventListener('click', async function () {
    // 获取用户输入的邮箱和密码
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    // 验证邮箱和密码不能为空
    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    // 发送 POST 请求到后端的登录接口
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // 设置请求体为 JSON 格式
        },
        body: JSON.stringify({ email, password })  // 将邮箱和密码作为请求体发送
    });

    const data = await response.json();  // 解析 JSON 响应

    if (response.status === 200) {
        // 登录成功，存储返回的 JWT token
        localStorage.setItem('token', data.token);  // 将 token 存储在 localStorage
        window.location.href = 'home.html';  // 登录成功后跳转到主页
    } else {
        // 登录失败，显示错误信息
        alert('Login failed: ' + data.message);  // 弹出错误信息
    }
});
