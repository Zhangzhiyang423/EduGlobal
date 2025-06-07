
// Get the article ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('article_id');

// Simulate loading the article content based on the article ID
const articles = {
    1: {
        title: "Cost of Living in KL a Challenge, Say Year 1 Students",
        author: "John Doe",
        content: "As a first-year student from Penang, adjusting to life in Kuala Lumpur has been a bit overwhelming..."
    },
    2: {
        title: "UM Engineering Students Praise Internship Opportunities",
        author: "Jane Smith",
        content: "Many Year 3 students in the Faculty of Engineering report strong internship support..."
    }
};

// Dynamically update the page based on articleId
if (articles[articleId]) {
    const article = articles[articleId];
    document.getElementById('commentContent').innerHTML = `
                <h3>${article.title}</h3>
                <p><strong>By:</strong> ${article.author}</p>
                <p>${article.content}</p>
            `;
} else {
    document.getElementById('commentContent').innerHTML = `
                <p>Article not found.</p>
            `;
}
