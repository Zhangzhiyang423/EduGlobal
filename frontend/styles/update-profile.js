function saveAndRedirect() {
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const cgpa = document.getElementById("cgpa").value;

  
        console.log("Saving data...");
        console.log("Full Name:", fullName);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("CGPA:", cgpa);

        localStorage.setItem("userFullName", fullName);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userCGPA", cgpa);

        window.location.assign("profile-1.html");
    }