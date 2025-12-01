

// Program Details Page Logic
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const programmeCode = urlParams.get('programme_code');

  // Find programme in global array
  const program = Array.isArray(programmeDetails)
    ? programmeDetails.find(p => p.programme_code === programmeCode)
    : null;

  if (!programmeCode || !program) {
    document.querySelector('.program-title').textContent = 'Program Not Found';
    document.querySelector('.about-program').textContent = 'No details available for this program.';
    // Optionally redirect to dashboard after a delay
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    return;
  }

  // Banner
  if (program.banner_image) {
    document.querySelector('.program-details-banner img').src = `../assets/${program.banner_image}`;
  }
  document.querySelector('.program-title').textContent = program.programme_name;

  // About
  document.querySelector('.about-program').textContent = program.about_program;

  // Learning outcomes
  const outcomes = (program.learning_outcomes || '').split(';').map(o => o.trim()).filter(Boolean);
  const learnList = document.querySelector('.learning-outcomes');
  learnList.innerHTML = '';
  outcomes.forEach(o => {
    const li = document.createElement('li');
    li.className = 'd-flex align-items-center mb-3';
    li.innerHTML = `<i class="bi bi-check-circle-fill text-success me-3"></i><span>${o}</span>`;
    learnList.appendChild(li);
  });

  // Features
  const featureTitles = [
    program.feature_1_title,
    program.feature_2_title,
    program.feature_3_title,
    program.feature_4_title
  ];
  const featureCards = document.querySelectorAll('.feature-card h5');
  featureCards.forEach((h5, i) => {
    h5.textContent = featureTitles[i] || 'N/A';
  });

  // Instructors
  const instructorNames = [
    program.instructor_1_name,
    program.instructor_2_name,
    program.instructor_3_name,
    program.instructor_4_name
  ];
  const instructorH5s = document.querySelectorAll('.instructor-img-container + h5');
  instructorH5s.forEach((h5, i) => {
    h5.textContent = instructorNames[i] || 'N/A';
  });

  // Badge
  document.querySelector('.testimonial-box .badge').textContent = `Universiti Malaya – ${program.programme_name}`;

  // (Optional) Entry requirements, tuition, campus, etc. can be added to a suitable info block if present

  // Update "Read Other Program Reviews" button href
  const reviewsBtn = document.querySelector('.testimonial-box a.btn-outline-primary');
  if (reviewsBtn) {
    reviewsBtn.href = `blog.html?programme_code=${program.programme_code}`;
  }
});
