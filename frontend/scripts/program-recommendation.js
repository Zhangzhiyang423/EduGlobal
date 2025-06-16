// search program button
function searchProgram() {
    const searchQuery = document.getElementById('searchInput').value.trim();

    if (searchQuery) {
        // 建议你将输入转为 slug 格式（可选）
        const programSlug = searchQuery.toLowerCase().replace(/\s+/g, "-");
        const targetURL = `program-details.html?program=${encodeURIComponent(programSlug)}`;
        window.location.href = targetURL;
    } else {
        alert("Please enter a program name.");
    }
}

// get Ai recommendation section
document.getElementById('getRecommendation').addEventListener('click', function () {
    document.getElementById('aiRecommendationProgram').scrollIntoView({ behavior: 'smooth' });

    setTimeout(function () {
        const recommendedPrograms = [
            {
                id: "information-systems",
                title: "Bachelor of Information Systems",
                description: "A program for students interested in information systems and technology."
            },
            {
                id: "software-engineering",
                title: "Bachelor of Software Engineering",
                description: "A program focusing on the development of software systems."
            },
            {
                id: "artificial-intelligence",
                title: "Bachelor of Artificial Intelligence",
                description: "A program focused on machine learning and AI technologies."
            }
        ];

        const programListContainer = document.getElementById('programList');
        programListContainer.innerHTML = '';

        recommendedPrograms.forEach(function (program) {
            const programCard = document.createElement('div');
            programCard.classList.add('col-md-4', 'mb-4');

            programCard.innerHTML = `
                <div class="card">
                    <img src="../assets/program.jpg" class="card-img-top" alt="${program.title}">
                    <div class="card-body">
                        <h5 class="card-title">${program.title}</h5>
                        <p class="card-text">${program.description}</p>
                        <a href="program-details.html?program=${program.id}" class="btn btn-outline-primary">View Details</a>
                    </div>
                </div>
            `;

            programListContainer.appendChild(programCard);
        });

        document.getElementById('aiRecommendationProgram').style.display = 'block';
    }, 1000); // 模拟加载时间
});
