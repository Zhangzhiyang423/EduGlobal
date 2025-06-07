function saveAndRedirect() {
        // 获取用户输入的数据
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const cgpa = document.getElementById("cgpa").value;

        // 模拟将数据发送到后端（实际中会通过 AJAX 请求发送）
        console.log("Saving data...");
        console.log("Full Name:", fullName);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("CGPA:", cgpa);

        // 假设这里我们把数据保存到 localStorage 或者数据库
        localStorage.setItem("userFullName", fullName);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userCGPA", cgpa);

        // 跳转回 Profile 页面
        window.location.assign("profile-1.html");
    }