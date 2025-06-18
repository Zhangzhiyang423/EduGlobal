let roiChart = null;  // 用来保存图表实例

function showROI() {
    console.log("Get ROI Analysis button clicked");

    const ctx = document.getElementById('roiChart').getContext('2d');
    if (roiChart != null) {
        roiChart.destroy();
    }

    const program = document.getElementById("program").value;
    const funding = document.getElementById("funding").value;

    let simulatedData = [];

    if (program === "bachelor" && funding === "self") {
        simulatedData = [350, 300, 200, 250]; // ROI 偏低
    } else if (program === "bachelor" && funding === "scholarship") {
        simulatedData = [520, 480, 460, 500]; // ROI 高
    } else if (program === "engineering" && funding === "self") {
        simulatedData = [280, 220, 180, 230]; // ROI 偏低
    } else if (program === "engineering" && funding === "scholarship") {
        simulatedData = [450, 430, 390, 420]; // ROI 中等偏高
    } else {
        simulatedData = [400, 350, 300, 500]; // fallback
    }

    roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Software Engineer', 'Data Scientist', 'Programmer', 'UI/UX Designer'],
            datasets: [{
                label: 'ROI (%)',
                data: simulatedData,
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
                borderColor: ['#388E3C', '#1976D2', '#F57C00', '#7B1FA2'],
                borderWidth: 1
            }]
        },
        options: {
            animation: { duration: 0 },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 600, // ✅ 固定最大值
                    ticks: {
                        stepSize: 100
                    }
                }
            }
        }
    });

    document.getElementById("roiResults").style.display = "block";
    document.getElementById("careerResults").style.display = "none";
}



// Function to show Career Forecast results
// Mock data representing the career tags for different programs
const careerTagsDatabase = {
    "computer-science": ["Software Engineer", "Data Scientist", "AI Specialist", "UI/UX Designer", "Machine Learning Engineer"],
    "engineering": ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Architect", "Project Manager"]
};

// Career forecast button click handler
function showCareerForecast() {
    // 获取选中的 field
    const selectedField = document.getElementById('field').value;

    // 生成对应 career tags（你已有的逻辑）
    const tags = careerTagsDatabase[selectedField];
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';

    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.innerText = tag;
            tagsContainer.appendChild(tagElement);
        });
        document.getElementById('careerResults').style.display = 'block';
    } else {
        tagsContainer.innerHTML = '<p>No career tags found for this program.</p>';
        document.getElementById('careerResults').style.display = 'block';
    }

    // ✅ 新增：调用画图函数，基于所选 field 加载图表
    drawChartsForField(selectedField);
}

// Charts for each field
function drawChartsForField(field) {
    const fieldData = {
        'computer-science': {
            pie: [225, 23, 10],
            line: {
                se: [30, 45, 60],
                da: [20, 30, 40],
                study: [10, 8, 5],
                unemp: [5, 3, 2]
            }
        },
        'engineering': {
            pie: [180, 35, 20],
            line: {
                se: [10, 20, 35],
                da: [5, 10, 15],
                study: [15, 10, 8],
                unemp: [3, 2, 1]
            }
        }
    };

    const selected = fieldData[field] || fieldData['computer-science'];

    // 销毁旧图表（避免叠加）
    if (window.pieChart) window.pieChart.destroy();
    if (window.lineChart) window.lineChart.destroy();

    // 📊 饼图
    const pieCtx = document.getElementById('employmentPieChart').getContext('2d');
    window.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Employed', 'Further Study', 'Unemployed'],
            datasets: [{
                data: selected.pie,
                backgroundColor: ['#6FCF97', '#56CCF2', '#EB5757'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,  // ✅ 添加这一行
            plugins: {
                legend: { position: 'bottom' }
            }
        }

    });

    // 📈 折线图
    const lineCtx = document.getElementById('careerLineChart').getContext('2d');
    window.lineChart = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['2021', '2022', '2023'],
            datasets: [
                {
                    label: 'Software Engineer',
                    data: selected.line.se,
                    borderColor: '#6FCF97',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Data Analyst',
                    data: selected.line.da,
                    borderColor: '#56CCF2',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Further Study',
                    data: selected.line.study,
                    borderColor: '#F2C94C',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Unemployed',
                    data: selected.line.unemp,
                    borderColor: '#EB5757',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,  // ✅ 添加这一行
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }

    });

    // 显示图表区域
    document.getElementById('employmentPieChartContainer').style.display = 'block';
    document.getElementById('careerLineChartContainer').style.display = 'block';
}
