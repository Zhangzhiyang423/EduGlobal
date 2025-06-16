document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const program = urlParams.get('program');

  // 模拟程序数据（可与后端字段保持一致）
  const PROGRAM_MAP = {
    "information-systems": {
      id: "information-systems",
      title: "Bachelor of Information Systems",
      description: "Learn how to design, manage, and optimize digital systems...",
      image: "../assets/program.jpg"
    },
    "software-engineering": {
      id: "software-engineering",
      title: "Bachelor of Software Engineering",
      description: "Focus on software development and system design...",
      image: "../assets/program.jpg"
    },
    "artificial-intelligence": {
      id: "artificial-intelligence",
      title: "Bachelor of Artificial Intelligence",
      description: "Explore AI, ML, and data analytics applications...",
      image: "../assets/program.jpg"
    }
  };

  const programData = PROGRAM_MAP[program];

  if (programData) {
    // 渲染页面
    document.getElementById("programTitle").textContent = programData.title;
    document.getElementById("programDescription").textContent = programData.description;

    // 模拟后端数据结构保存到 localStorage
    const viewed = JSON.parse(localStorage.getItem("viewedPrograms")) || [];
    const exists = viewed.some(p => p.id === programData.id);
    if (!exists) {
      viewed.push({
        ...programData,
        link: window.location.pathname + "?program=" + programData.id,
        viewedAt: Date.now()
      });
      localStorage.setItem("viewedPrograms", JSON.stringify(viewed));
    }
  }
});
