// dashboard-sentiment.js
// Renders Sentiment Snapshot charts using survey-summary-data.js

document.addEventListener('DOMContentLoaded', function () {
    // Pie chart: Overall Sentiment about University Life
    var uniLifeCtx = document.getElementById('uniLifeSentimentChart');
    var jobProspectsCtx = document.getElementById('jobProspectsChart');

    // Defensive: check if summary arrays exist
    var uniLifeData = Array.isArray(window.surveyUniLifeSentimentDist) ? window.surveyUniLifeSentimentDist : [];
    var jobProspectsData = Array.isArray(window.surveyJobProspectsDist) ? window.surveyJobProspectsDist : [];

    // Mapping for readable labels
    var uniLifeLabelsMap = {
        'Very_positive': 'Very positive',
        'Somewhat_positive': 'Somewhat positive',
        'Neutral': 'Neutral',
        'Somewhat_negative': 'Somewhat negative',
        'Negative': 'Negative'
    };
    var jobProspectsLabelsMap = {
        'Very_strong': 'Very strong',
        'Strong': 'Strong',
        'Neutral_unsure': 'Neutral / Unsure',
        'Weak': 'Weak',
        'Very_weak': 'Very weak'
    };

    // Pie chart data
    var pieLabels = uniLifeData.map(item => uniLifeLabelsMap[item.category] || item.category);
    var pieCounts = uniLifeData.map(item => item.count);
    var pieColors = [
        '#4CAF50', // Very positive
        '#8BC34A', // Somewhat positive
        '#FFC107', // Neutral
        '#FF9800', // Somewhat negative
        '#F44336'  // Negative
    ];

    // Bar chart data
    var barLabels = jobProspectsData.map(item => jobProspectsLabelsMap[item.category] || item.category);
    var barCounts = jobProspectsData.map(item => item.count);
    var barColors = [
        '#1976D2', // Very strong
        '#42A5F5', // Strong
        '#FFC107', // Neutral / Unsure
        '#FF9800', // Weak
        '#D32F2F'  // Very weak
    ];

    // Render Pie Chart
    if (uniLifeCtx && pieLabels.length > 0 && pieCounts.length > 0) {
        new Chart(uniLifeCtx, {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieCounts,
                    backgroundColor: pieColors.slice(0, pieLabels.length)
                }]
            },
            options: {
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: false }
                }
            }
        });
    }

    // Render Bar Chart
    if (jobProspectsCtx && barLabels.length > 0 && barCounts.length > 0) {
        new Chart(jobProspectsCtx, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    data: barCounts,
                    backgroundColor: barColors.slice(0, barLabels.length)
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: false }
                }
            }
        });
    }
});
