// 🔍 Search program button (keep as is)
function searchProgram() {
    const searchQuery = document.getElementById('searchInput').value.trim();

    if (searchQuery) {
        const programSlug = searchQuery.toLowerCase().replace(/\s+/g, "-");
        const targetURL = `program-details.html?program=${encodeURIComponent(programSlug)}`;
        window.location.href = targetURL;
    } else {
        alert("Please enter a program name.");
    }
}

// Helper: collect checkbox values into an array
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
        (el) => el.value
    );
}

// Helper: render programmes
function renderPrograms(programs) {
    const programListContainer = document.getElementById('programList');
    programListContainer.innerHTML = '';

    if (!programs || programs.length === 0) {
        programListContainer.innerHTML = '<p>No programmes found for your profile.</p>';
        return;
    }

    programs.forEach((program) => {
        const scoreTotal = program.score_total != null ? (program.score_total * 100).toFixed(0) : '–';
        const b = program.score_breakdown || {};

        const academic = b.academic_fit != null ? (b.academic_fit * 100).toFixed(0) + '%' : '–';
        const interest = b.interest_fit != null ? (b.interest_fit * 100).toFixed(0) + '%' : '–';
        const stream = b.stream_fit != null ? (b.stream_fit * 100).toFixed(0) + '%' : '–';
        const subject = b.subject_fit != null ? (b.subject_fit * 100).toFixed(0) + '%' : '–';
        const english = b.english_fit != null ? (b.english_fit * 100).toFixed(0) + '%' : '–';
        const financial = b.financial_fit != null ? (b.financial_fit * 100).toFixed(0) + '%' : '–';
        const sports = b.sports_fit != null ? (b.sports_fit * 100).toFixed(0) + '%' : '–';
        const interview = b.interview_fit != null ? (b.interview_fit * 100).toFixed(0) + '%' : '–';

        const programCard = document.createElement('div');
        programCard.classList.add('col-md-4', 'mb-4');

        programCard.innerHTML = `
            <div class="card h-100">
                <img src="../assets/program.jpg" class="card-img-top" alt="${program.programme_name || 'Programme'}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${program.programme_name || program.title}</h5>
                    <p class="text-muted small mb-2">${program.faculty || ''}</p>
                    <p class="mb-2"><strong>AI Match:</strong> ${scoreTotal}/100</p>
                    <table class="table table-sm small mb-3">
                        <tbody>
                            <tr><td>Academic fit</td><td class="text-end">${academic}</td></tr>
                            <tr><td>Interest match</td><td class="text-end">${interest}</td></tr>
                            <tr><td>Stream match</td><td class="text-end">${stream}</td></tr>
                            <tr><td>Subject fit</td><td class="text-end">${subject}</td></tr>
                            <tr><td>English fit</td><td class="text-end">${english}</td></tr>
                            <tr><td>Financial fit</td><td class="text-end">${financial}</td></tr>
                            <tr><td>Sports fit</td><td class="text-end">${sports}</td></tr>
                            <tr><td>Interview fit</td><td class="text-end">${interview}</td></tr>
                        </tbody>
                    </table>
                    <a href="program-details.html?program=${encodeURIComponent(program.programme_code || program.id || '')}"
                       class="btn btn-outline-primary mt-auto">
                        View Details
                    </a>
                </div>
            </div>
        `;

        programListContainer.appendChild(programCard);
    });

    document.getElementById('aiRecommendationProgram').style.display = 'block';
}

// 🎯 Get AI Recommendations
document.getElementById('getRecommendation').addEventListener('click', async function () {
    // Scroll down to results section
    document.getElementById('aiRecommendationProgram').scrollIntoView({ behavior: 'smooth' });

    // Collect form values
    const qualificationType = document.getElementById('qualificationType').value;
    const overallResultRaw = document.getElementById('overallResult').value.trim();
    // derive numeric result when possible (e.g. CGPA 3.75, ATAR 85, IB 32, percent 80)
    let resultNumeric = null;
    if (overallResultRaw) {
        const m = String(overallResultRaw).match(/([0-9]+(\.[0-9]+)?)/);
        if (m) resultNumeric = parseFloat(m[1]);
    }

    const streamRadio = document.querySelector('input[name="streamType"]:checked');
    const streamType = streamRadio ? streamRadio.value : null;

    const subjectFlags = {
        has_math: document.getElementById('hasMath').checked,
        has_two_science: document.getElementById('hasTwoScience').checked,
        has_cs_subject: document.getElementById('hasCsSubject').checked,
        has_foreign_language: document.getElementById('hasForeignLanguage').checked
    };

    const englishTestType = document.getElementById('englishTestType').value;
    const englishScoreRaw = document.getElementById('englishScore').value;
    const englishScore = englishScoreRaw ? parseFloat(englishScoreRaw) : null;

    const preferredFields = getCheckedValues('preferredFields');
    const strengths = getCheckedValues('strengths');

    const sportsRadio = document.querySelector('input[name="sportsInvolvement"]:checked');
    const sportsInvolvement = sportsRadio ? sportsRadio.value : 'no';

    const interviewRadio = document.querySelector('input[name="interviewPortfolio"]:checked');
    const okForInterviewPortfolio = interviewRadio ? interviewRadio.value : 'yes';

    const budgetRaw = document.getElementById('budgetPerYear').value;
    const budgetPerYear = budgetRaw ? parseFloat(budgetRaw) : null;

    const payload = {
        qualification_type: qualificationType,
        overall_result_raw: overallResultRaw,
        result_numeric: resultNumeric,
        stream_type: streamType,
        subject_flags: subjectFlags,
        english_test_type: englishTestType,
        english_score: englishScore,
        preferred_fields: preferredFields,
        strengths: strengths,
        sports_involvement: sportsInvolvement,
        ok_for_interview_portfolio: okForInterviewPortfolio,
        budget_per_year: budgetPerYear
    };

    console.log('Sending payload to /api/recommendations:', payload);

    try {
        const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const recommendedPrograms = await response.json();
        renderPrograms(recommendedPrograms);
    } catch (error) {
        console.error('Error fetching recommendations:', error);

        // Simple fallback demo so the UI still works if backend not ready
        const fallbackPrograms = [
            {
                programme_code: 'DEMO-CS',
                programme_name: 'Bachelor of Computer Science (Demo)',
                faculty: 'Faculty of Computer Science & IT',
                score_total: 0.81,
                score_breakdown: {
                    academic_fit: 0.9,
                    interest_fit: 1.0,
                    roi: 0.6,
                    career: 0.8,
                    perception: 0.7
                }
            }
        ];
        renderPrograms(fallbackPrograms);
    }
});
