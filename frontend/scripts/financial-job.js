let roiChart = null;  // 用来保存图表实例

function showROI() {
    console.log("Get ROI Analysis button clicked");

    // 获取 canvas 元素
    const ctx = document.getElementById('roiChart').getContext('2d');

    // 如果图表已经创建过，销毁图表实例
    if (roiChart != null) {
        console.log("Destroying previous chart.");
        roiChart.destroy();  // 销毁现有的图表
    }

    // 模拟从后端返回的数据
    const simulatedData = [400, 350, 300, 500]; // 模拟的 ROI 数据

    // 创建图表
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Software Engineer', 'Data Scientist', 'Programmer', 'UI/UX Designer'],
            datasets: [{
                label: 'ROI (%)',
                data: simulatedData,  // 使用模拟的 ROI 数据
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
                borderColor: ['#388E3C', '#1976D2', '#F57C00', '#7B1FA2'],
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: 0 // 禁用动画效果
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 50
                    }
                }
            }
        }
    });

    // 显示 ROI 图表区域
    document.getElementById("roiResults").style.display = "block";
    document.getElementById("careerResults").style.display = "none"; // 隐藏 Career Forecast 结果区域

    console.log("ROI chart created successfully.");
}

// Function to show Career Forecast results
// Mock data representing the career tags for different programs
const careerTagsDatabase = {
    "computer-science": ["Software Engineer", "Data Scientist", "AI Specialist", "UI/UX Designer", "Machine Learning Engineer"],
    "engineering": ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Architect", "Project Manager"]
};

// Career forecast button click handler
function showCareerForecast() {
    // Get the selected field
    const selectedField = document.getElementById('field').value;

    // Get career tags for the selected field from the mock database
    const tags = careerTagsDatabase[selectedField];

    // Clear existing tags
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';  // Clear the tags container

    // Display the tags if any are available
    if (tags && tags.length > 0) {
        tags.forEach(tag => {
            // Create a new tag element
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.innerText = tag;

            // Append the tag element to the tags container
            tagsContainer.appendChild(tagElement);
        });

        // Display the results section
        document.getElementById('careerResults').style.display = 'block';
    } else {
        // If no tags found, display a message
        tagsContainer.innerHTML = '<p>No career tags found for this program.</p>';
        document.getElementById('careerResults').style.display = 'block';
    }
}
