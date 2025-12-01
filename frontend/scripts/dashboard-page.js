// Dashboard Top 3 Programs integration
// Requires: reviews-data.js, program-details-data.js

document.addEventListener("DOMContentLoaded", function () {
  // Helper: Compute overall rating and review count for a programme
  function getProgrammeReviewStats(programme_code) {
    const relevantReviews = Array.isArray(reviews)
      ? reviews.filter(r => r.programme_code === programme_code)
      : [];
    let overallReviews = relevantReviews.filter(r => r.aspect === "OVERALL_SATISFACTION");
    let ratings = overallReviews.length > 0
      ? overallReviews.map(r => Number(r.rating))
      : relevantReviews.map(r => Number(r.rating));
    const avgRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
      : null;
    return {
      programme_code,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      reviewCount: relevantReviews.length
    };
  }

  // Build summary list for all programmes
  const summaries = Array.isArray(programmeDetails)
    ? programmeDetails.map(p => {
        const stats = getProgrammeReviewStats(p.programme_code);
        return {
          ...p,
          avgRating: stats.avgRating,
          reviewCount: stats.reviewCount
        };
      })
    : [];

  // Sort: avgRating desc, reviewCount desc, programme_name asc
  summaries.sort((a, b) => {
    if ((b.avgRating ?? -1) !== (a.avgRating ?? -1)) {
      return (b.avgRating ?? -1) - (a.avgRating ?? -1);
    }
    if (b.reviewCount !== a.reviewCount) {
      return b.reviewCount - a.reviewCount;
    }
    return a.programme_name.localeCompare(b.programme_name);
  });

  // Select top 3
  const top3 = summaries.slice(0, 3);

  // Render Top 3 cards dynamically
  const container = document.getElementById('viewedProgramsContainer');
  if (container) {
    container.innerHTML = '';
    top3.forEach(prog => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      card.innerHTML = `
        <div class="card h-100 shadow-sm" data-programme-code="${prog.programme_code}">
          <img src="../assets/${prog.banner_image}" class="card-img-top" alt="${prog.programme_name}">
          <div class="card-body">
            <h5 class="card-title">${prog.programme_name}</h5>
            <p class="card-text">${prog.faculty_name} | ${prog.campus}</p>
            <div class="rating-summary text-muted mb-2">
              ${prog.avgRating !== null ? `Overall rating: ${prog.avgRating} / 5 (${prog.reviewCount} reviews)` : 'Overall rating: N/A (no reviews yet)'}
            </div>
            <a href="program-details.html?programme_code=${prog.programme_code}" class="btn btn-outline-primary">View Details</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }
  // --- Student Perception Snapshot logic ---
  // Aspect codes and labels
  const ASPECTS = [
    "PROGRAMME_QUALITY",
    "CAREER_EMPLOYABILITY",
    "CAMPUS_ENV_FACILITIES",
    "COST_LIVING_AFFORDABILITY",
    "STUDENT_SUPPORT_SERVICES",
    "SOCIAL_LIFE_COMMUNITY",
    "OVERALL_SATISFACTION"
  ];
  const ASPECT_LABELS = {
    PROGRAMME_QUALITY: "Programme Quality & Teaching",
    CAREER_EMPLOYABILITY: "Career & Employability",
    CAMPUS_ENV_FACILITIES: "Campus Environment & Facilities",
    COST_LIVING_AFFORDABILITY: "Cost of Living & Affordability",
    STUDENT_SUPPORT_SERVICES: "Student Support & Services",
    SOCIAL_LIFE_COMMUNITY: "Social Life & Community",
    OVERALL_SATISFACTION: "Overall Satisfaction"
  };

  // Compute overall satisfaction
  function computeOverallSatisfaction() {
    const overallReviews = reviews.filter(r => r.aspect === "OVERALL_SATISFACTION");
    let base = overallReviews.length > 0 ? overallReviews : reviews;
    if (base.length === 0) return { avgRating: null, count: 0 };
    const sum = base.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avg = sum / base.length;
    return { avgRating: Number(avg.toFixed(1)), count: base.length };
  }

  // Compute average rating per aspect
  function computeAspectAverages() {
    return ASPECTS.map(aspect => {
      const filtered = reviews.filter(r => r.aspect === aspect);
      if (filtered.length === 0) return { aspect, avgRating: null, count: 0 };
      const sum = filtered.reduce((acc, r) => acc + Number(r.rating || 0), 0);
      const avg = sum / filtered.length;
      return { aspect, avgRating: Number(avg.toFixed(1)), count: filtered.length };
    });
  }

  // Find most praised aspect
  function findMostPraised(aspectAvgs) {
    const valid = aspectAvgs.filter(a => a.count >= 1 && a.avgRating !== null);
    if (valid.length === 0) return null;
    return valid.reduce((max, a) => a.avgRating > max.avgRating ? a : max, valid[0]);
  }

  // Find top concern aspect
  function findTopConcern(aspectAvgs) {
    let valid = aspectAvgs.filter(a => a.count >= 3 && a.avgRating !== null);
    if (valid.length === 0) valid = aspectAvgs.filter(a => a.count >= 1 && a.avgRating !== null);
    if (valid.length === 0) return null;
    return valid.reduce((min, a) => a.avgRating < min.avgRating ? a : min, valid[0]);
  }

  // Fill the snapshot card
  const overallEl = document.getElementById("snapshot-overall");
  const praisedEl = document.getElementById("snapshot-most-praised");
  const concernEl = document.getElementById("snapshot-top-concern");
  if (overallEl) {
    const overall = computeOverallSatisfaction();
    const aspectAvgs = computeAspectAverages();
    const mostPraised = findMostPraised(aspectAvgs);
    const topConcern = findTopConcern(aspectAvgs);

    // Overall satisfaction line
    if (overall.avgRating !== null) {
      overallEl.textContent = `Overall satisfaction: ${overall.avgRating} / 5 (${overall.count} reviews)`;
      overallEl.classList.remove('text-success', 'text-warning', 'text-danger');
      if (overall.avgRating >= 4.0) overallEl.classList.add('text-success');
      else if (overall.avgRating >= 3.0) overallEl.classList.add('text-warning');
      else overallEl.classList.add('text-danger');
    } else {
      overallEl.textContent = 'Overall satisfaction: N/A (no reviews yet)';
    }

    // Most praised aspect
    if (mostPraised) {
      praisedEl.textContent = `Most praised: ${ASPECT_LABELS[mostPraised.aspect]} (${mostPraised.avgRating} / 5)`;
    } else {
      praisedEl.textContent = 'Most praised: N/A';
    }

    // Top concern aspect
    if (topConcern) {
      concernEl.textContent = `Top concern: ${ASPECT_LABELS[topConcern.aspect]} (${topConcern.avgRating} / 5)`;
    } else {
      concernEl.textContent = 'Top concern: N/A';
    }
  }
});
