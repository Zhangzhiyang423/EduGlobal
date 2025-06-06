document.getElementById('getRecommendation').addEventListener('click', function() {
    // 滚动到 AI 推荐区域
    document.getElementById('aiRecommendationProgram').scrollIntoView({ behavior: 'smooth' });

    // 模拟 AI 算法推荐的课程内容
    setTimeout(function() {
        // 这是模拟推荐的课程数据
        const recommendedPrograms = [
            { title: "Bachelor of Information Systems", description: "A program for students interested in information systems and technology." },
            { title: "Bachelor of Software Engineering", description: "A program focusing on the development of software systems." },
            { title: "Bachelor of Artificial Intelligence", description: "A program focused on machine learning and AI technologies." },
        ];

        // 获取推荐区的程序列表容器
        const programListContainer = document.getElementById('programList');
        programListContainer.innerHTML = ''; // 清空原始内容

        // 根据推荐的程序填充内容
        recommendedPrograms.forEach(function(program) {
            const programCard = document.createElement('div');
            programCard.classList.add('col-md-4', 'mb-4');  // 使卡片按列排列
            programCard.innerHTML = `
                <div class="program-card">
                    <div class="card h-100">
                        <img src="../assets/program.jpg" class="card-img-top" alt="Program Image">
                        <div class="card-body">
                            <h5 class="card-title">${program.title}</h5>
                            <p class="card-text">${program.description}</p>
                        </div>
                    </div>
                </div>
            `;
            programListContainer.appendChild(programCard);
        });

        // 显示推荐部分
        document.getElementById('aiRecommendationProgram').classList.add('show');
    }, 1000); // 模拟加载时间
});
