// 等待文档加载完成后再执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取表单和按钮元素
    const form = document.querySelector('form');
    const button = document.querySelector('button[type="submit"]');

    // 监听表单提交事件
    form.addEventListener('submit', async function (e) {
        e.preventDefault();  // 阻止表单默认提交行为

        // 获取用户输入的数据
        const name = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // 验证数据是否完整
        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // 发送 POST 请求到后端的注册接口
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }) // 将表单数据发送到后端
            });

            const data = await response.json();  // 解析后端返回的 JSON 数据

            if (response.status === 201) {
                // 如果注册成功，跳转到成功页面
                window.location.href = 'create-account-success.html';
            } else {
                // 否则，显示错误信息
                alert('Registration failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
