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
    if (user) {
        // 显示用户名或其他用户信息
        document.getElementById('welcomeMessage').innerText =
            `Welcome back, ${user.name || user.email || "Student"}`;

        // 显示欢迎弹窗
        var myModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
        myModal.show();
    } else {
        // 如果没有登录，跳转到登录页面
        window.location.href = 'login.html';
    }
};
