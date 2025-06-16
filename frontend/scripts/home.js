// 解码 JWT token 并获取用户信息
function getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // 解码 JWT token（不使用库，简单的 base64 解码）
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // 返回解码后的用户数据
}

// 在页面加载时显示用户信息
window.onload = function () {
    const user = getUserFromToken();
    const justLoggedIn = localStorage.getItem('justLoggedIn');

    if (user) {
        // 显示用户名
        document.getElementById('welcomeMessage').innerText =
            `Welcome back, ${user.name || user.email || "Student"}`;

        // 仅当是刚登录完才弹出 modal
        if (justLoggedIn === 'true') {
            var myModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
            myModal.show();
            localStorage.removeItem('justLoggedIn');  // 弹窗后清除
        }
    } else {
        window.location.href = 'login.html';
    }
};
