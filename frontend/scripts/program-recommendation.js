// search program button
function searchProgram() {
    // Get the value from the search input field
    const searchQuery = document.getElementById('searchInput').value.trim();

    // If there's a search query, construct the URL and navigate to it
    if (searchQuery) {
        // You can add more logic to process the search query if needed (e.g., encoding spaces, special characters)
        const targetURL = `program-details.html?search=${encodeURIComponent(searchQuery)}`;
        window.location.href = targetURL;
    } else {
        alert("Please enter a program name.");
    }
}




// get Ai recommendation section
document.getElementById('getRecommendation').addEventListener('click', function() {
    // 滚动到 AI 推荐区域
    document.getElementById('aiRecommendationProgram').scrollIntoView({ behavior: 'smooth' });

    // 模拟 AI 算法推荐的课程内容
    setTimeout(function() {
        // 这是模拟推荐的课程数据
        const recommendedPrograms = [
            { id: 1, title: "Bachelor of Information Systems", description: "A program for students interested in information systems and technology." },
            { id: 2, title: "Bachelor of Software Engineering", description: "A program focusing on the development of software systems." },
            { id: 3, title: "Bachelor of Artificial Intelligence", description: "A program focused on machine learning and AI technologies." },
        ];

        // 获取推荐区的程序列表容器
        const programListContainer = document.getElementById('programList');
        programListContainer.innerHTML = ''; // 清空原始内容

        // 根据推荐的程序填充内容
        recommendedPrograms.forEach(function(program) {
            const programCard = document.createElement('div');
            programCard.classList.add('col-md-4');
            programCard.classList.add('mb-4');
            programCard.innerHTML = `
                <div class="card">
                    <img src="../assets/program.jpg" class="card-img-top" alt="${program.title}">
                    <div class="card-body">
                        <h5 class="card-title">${program.title}</h5>
                        <p class="card-text">${program.description}</p>
                        <a href="program-details.html?programId=${program.id}" class="btn btn-outline-primary">View Details</a>
                    </div>
                </div>
            `;
            programListContainer.appendChild(programCard);
        });

        // 显示推荐部分
        document.getElementById('aiRecommendationProgram').style.display = 'block';
    }, 1000); // 模拟加载时间
});
