// Student Reviews page logic
// Assumes reviews-data.js is loaded and exposes 'reviews' array

// If using ES6 modules, you would import, but for now, reviews is global


// Fetch reviews from backend and render
// Helper to get query parameter from URL
function getQueryParam(name) {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  return params.get(name);
}

document.addEventListener('DOMContentLoaded', function () {
  const programmeSelect = document.getElementById('filter-programme');
  const aspectSelect = document.getElementById('filter-aspect');
  const sortSelect = document.getElementById('sort-by');
  const reviewsContainer = document.getElementById('reviews-container');
  let allReviews = [];

  // Fetch reviews from backend
  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      allReviews = data;
      populateDropdowns();
      // --- STEP 5: Filter by programme_code from query param on initial load ---
      var initialProgrammeCode = getQueryParam('programme_code');
      if (initialProgrammeCode) {
        // Pre-select the programme in the filter dropdown
        if (programmeSelect) {
          programmeSelect.value = initialProgrammeCode;
        }
        // Only show reviews for that programme
        updateReviews();
      } else {
        // Default: show all reviews
        if (programmeSelect) programmeSelect.value = '';
        updateReviews();
      }
    } catch (err) {
      reviewsContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger">Error loading reviews: ${err.message}</div></div>`;
    }
  }

  // Helper: get unique values from reviews array
  function getUnique(field) {
    return [...new Set(allReviews.map(r => r[field]))];
  }

  // Load all programme codes and names from backend /api/
  let programmeList = [];
  async function loadProgrammeList() {
    try {
      const res = await fetch('/api/');
      if (!res.ok) throw new Error('Failed to load programme list');
      const data = await res.json();
      programmeList = Array.isArray(data) ? data.map(p => ({
        code: p.programmeCode || p.programme_code || '',
        name: p.programmeName || p.programme_name || 'Unnamed',
        faculty: p.faculty || ''
      })) : [];
    } catch (err) {
      programmeList = [];
    }
  }

  // Populate dropdowns with all programme names from backend
  function populateDropdowns() {
    // Programme
    while (programmeSelect.options.length > 1) programmeSelect.remove(1);
    programmeList.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.code;
      opt.textContent = p.name + (p.faculty ? ' — ' + p.faculty : '');
      programmeSelect.appendChild(opt);
    });
    // Aspect
    const aspects = getUnique('aspect');
    while (aspectSelect.options.length > 1) aspectSelect.remove(1);
    aspects.forEach(aspect => {
      const opt = document.createElement('option');
      opt.value = aspect;
      opt.textContent = aspect;
      aspectSelect.appendChild(opt);
    });
  }

  // Render reviews into cards
  function renderReviews(filteredReviews) {
    reviewsContainer.innerHTML = '';
    if (filteredReviews.length === 0) {
      reviewsContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">No reviews found.</div></div>';
      return;
    }
    filteredReviews.forEach(review => {
      let shortText = review.comment_text;
      if (shortText.length > 180) {
        shortText = shortText.slice(0, 180) + '...';
      }
      const card = document.createElement('div');
      card.className = 'col-12 col-md-6';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-bold">${review.programme_name || review.programme_code}</span>
            <span class="badge bg-secondary">${review.aspect}</span>
          </div>
          <div class="card-body">
            <div class="mb-2"><span class="text-warning">&#9733;</span> ${review.rating}/5</div>
            <h5 class="card-title">${review.comment_title}</h5>
            <p class="card-text">${shortText}</p>
          </div>
          <div class="card-footer text-end small text-muted">
            ${review.created_at ? new Date(review.created_at).toLocaleString() : ''}
          </div>
        </div>
      `;
      reviewsContainer.appendChild(card);
    });
  }

  // Filtering and sorting logic
  function getFilteredSortedReviews() {
    let filtered = allReviews.slice();
    const programme = programmeSelect.value;
    const aspect = aspectSelect.value;
    const sortBy = sortSelect.value;
    if (programme) {
      filtered = filtered.filter(r => r.programme_code === programme);
    }
    if (aspect) {
      filtered = filtered.filter(r => r.aspect === aspect);
    }
    if (sortBy === 'latest') {
      filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    } else if (sortBy === 'rating-desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    return filtered;
  }

  programmeSelect.addEventListener('change', updateReviews);
  aspectSelect.addEventListener('change', updateReviews);
  sortSelect.addEventListener('change', updateReviews);

  function updateReviews() {
    renderReviews(getFilteredSortedReviews());
  }

  sortSelect.value = 'latest';
  loadProgrammeList().then(fetchReviews);
});
