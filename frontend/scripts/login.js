window.addEventListener('DOMContentLoaded', (event) => {
    const loginButton = document.querySelector('button');  // 确保选择到正确的按钮
    console.log(loginButton);  // 确认是否选择到了正确的按钮

    if (loginButton) {
        loginButton.addEventListener('click', async function (event) {
            event.preventDefault();  // 阻止表单提交行为

            console.log("Login button clicked");  // 打印日志，确认按钮点击事件触发

            const email = document.querySelector('input[type="email"]').value;
            const password = document.querySelector('input[type="password"]').value;

            // 验证邮箱和密码不为空
            if (!email || !password) {
                alert("Please enter both email and password");
                return;
            }

            console.log("Sending request to backend");

            // 发送 POST 请求到后端
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })  // 将邮箱和密码作为请求体发送
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.status === 200) {
                localStorage.setItem('token', data.token);  // 存储 token
                console.log('Login successful, redirecting...');
                window.location.href = 'home.html';  // 登录成功后跳转到主页
            } else {
                alert('Login failed: ' + data.message);  // 登录失败提示
            }
        });
    } else {
        console.log("Login button not found!");
    }
});
