// program-details.js

document.addEventListener('DOMContentLoaded', function () {
    // Extract the program parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const program = urlParams.get('program');

    // Dynamically change the content based on the program parameter
    const programTitle = document.getElementById('programTitle');
    const programDescription = document.getElementById('programDescription');

    if (program === 'information-systems') {
        programTitle.textContent = "Bachelor of Information Systems";
        programDescription.textContent = "Learn how to design, manage, and optimize digital systems that support business operations, decision-making, and innovation.";
    } else if (program === 'software-engineering') {
        programTitle.textContent = "Bachelor of Software Engineering";
        programDescription.textContent = "Focus on software development, programming, and system design.";
    } else if (program === 'artificial-intelligence') {
        programTitle.textContent = "Bachelor of Artificial Intelligence";
        programDescription.textContent = "Explore artificial intelligence, machine learning, and data analytics applications.";
    } else {
        programTitle.textContent = "Program Not Found";
        programDescription.textContent = "The selected program details are not available.";
    }
});
