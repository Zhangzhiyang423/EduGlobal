// search program button
function searchProgram() {
    const searchQuery = document.getElementById('searchInput').value.trim();

    if (searchQuery) {
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
        const language = document.getElementById('language').value;
        const gpa = parseFloat(document.getElementById('gpa').value);
        const field = document.getElementById('field').value;

        let recommendedPrograms = [];

        if (language === 'ielts' && gpa >= 3.5 && field === 'computer-science') {
            recommendedPrograms = [
                {
                    id: "information-systems",
                    title: "Bachelor of Information Systems",
                    description: "Strong match for CS students with good IELTS score."
                },
                {
                    id: "data-science",
                    title: "Bachelor of Data Science",
                    description: "Ideal for students with analytical skills."
                }
            ];
        } else if (language === 'toefl' && gpa >= 3.0 && field === 'engineering') {
            recommendedPrograms = [
                {
                    id: "mechanical-engineering",
                    title: "Bachelor of Mechanical Engineering",
                    description: "Focuses on core engineering principles."
                },
                {
                    id: "civil-engineering",
                    title: "Bachelor of Civil Engineering",
                    description: "Ideal for infrastructure-oriented students."
                }
            ];
        } else {
            // fallback
            recommendedPrograms = [
                {
                    id: "general-studies",
                    title: "Bachelor of General Studies",
                    description: "A flexible program for exploring interests."
                }
            ];
        }

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
    }, 1000); 
});
