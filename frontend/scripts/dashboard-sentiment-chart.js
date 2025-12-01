// Beautiful sentiment snapshot chart for dashboard
// Requires survey-summary-data.js

document.addEventListener('DOMContentLoaded', function () {
  if (typeof surveyUniLifeSentimentDist === 'undefined') return;
  const ctx = document.getElementById('sentimentSnapshotChart');
  if (!ctx) return;

  // Prepare data
  const labels = surveyUniLifeSentimentDist.map(d => d.category.replace(/_/g, ' '));
  const data = surveyUniLifeSentimentDist.map(d => d.count);
  const colors = [
    '#198754', // Very_positive (green)
    '#0d6efd', // Somewhat_positive (blue)
    '#ffc107', // Neutral (yellow)
    '#fd7e14', // Somewhat_negative (orange)
    '#dc3545'  // Negative (red)
  ];

  // Chart.js pie chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#333',
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: 'University Life Sentiment',
          font: { size: 18 },
          color: '#0d6efd'
        }
      },
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false
    }
  });
});
