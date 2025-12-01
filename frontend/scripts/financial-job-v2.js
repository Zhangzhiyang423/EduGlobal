/* Conservative ES5 script to populate the programme dropdown and call ROI API.
   Replaces previous file to avoid syntax errors in older browsers or stray characters.
*/
(function () {
    'use strict';

    var roiChart = null;

    var samplePrograms = [
        { programmeCode: 'WK01', programmeName: 'Bachelor of Computer Science', faculty: 'Faculty of Computer Science and Information Technology', tuitionTotal: 60000, durationYears: 3 },
        { programmeCode: 'WK02', programmeName: 'Bachelor of Civil Engineering', faculty: 'Faculty of Engineering', tuitionTotal: 80000, durationYears: 4 },
        { programmeCode: 'WK03', programmeName: 'Bachelor of Business Administration', faculty: 'Faculty of Business and Economics', tuitionTotal: 50000, durationYears: 3 }
    ];

    var availablePrograms = [];

    function safeNumber(v) {
        var n = Number(v);
        return (isNaN(n) ? 0 : n);
    }

    function fetchProgrammesFromServer() {
        return fetch('/api/').then(function (res) {
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        }).then(function (data) {
            if (Array.isArray(data) && data.length) {
                availablePrograms = data.map(function (p) {
                    return {
                        programmeCode: p.programmeCode || p.programme_code || p.code || '',
                        programmeName: p.programmeName || p.programme_name || p.name || '',
                        faculty: p.faculty || p.facultyName || p.faculty_name || '',
                        tuitionTotal: safeNumber(p.tuitionTotal || p.tuition_total || p.tuition),
                        durationYears: safeNumber(p.durationYears || p.duration_years || p.duration) || 3
                    };
                });
                console.log('Loaded ' + availablePrograms.length + ' programmes from server');
            } else {
                console.warn('No programmes returned from server');
                availablePrograms = samplePrograms;
            }
        })['catch'](function (err) {
            console.warn('Programs fetch failed, using samplePrograms', err);
            availablePrograms = samplePrograms;
        });
    }

    function populateProgramSelect() {
        var sel = document.getElementById('programSelect');
        if (!sel) return;
        sel.innerHTML = '';
        var list = (availablePrograms && availablePrograms.length) ? availablePrograms : samplePrograms;
        for (var i = 0; i < list.length; i++) {
            var p = list[i];
            var opt = document.createElement('option');
            opt.value = p.programmeCode || ('p' + i);
            opt.appendChild(document.createTextNode((p.programmeName || 'Unnamed') + ' — ' + (p.faculty || '')));
            // Attach data attributes for more robust mapping to career fields
            try { opt.dataset.faculty = p.faculty || ''; } catch (e) { /* ignore */ }
            try { opt.dataset.field = ''; } catch (e) { /* ignore */ }
            sel.appendChild(opt);
        }
    }

    function showError(message) {
        var container = document.getElementById('roiSummaryCards');
        if (container) container.innerHTML = '<div class="alert alert-danger w-100">' + message + '</div>';
        var results = document.getElementById('roiResults');
        if (results) results.style.display = 'block';
    }

    function getSelectedProgrammes() {
        var sel = document.getElementById('programSelect');
        if (!sel) return [];
        var code = sel.value;
        var listSource = (availablePrograms && availablePrograms.length) ? availablePrograms : samplePrograms;
        for (var i = 0; i < listSource.length; i++) {
            if (listSource[i].programmeCode === code) return [listSource[i]];
        }
        return listSource.length ? [listSource[0]] : [];
    }

    function formatRm(v) {
        var n = Number(v);
        if (isNaN(n)) return '-';
        return 'RM ' + n.toLocaleString();
    }

    function formatPct(v) {
        var n = Number(v);
        if (isNaN(n)) return '-';
        return n.toFixed(1) + '%';
    }

    function renderRoiResults(results) {
        var container = document.getElementById('roiSummaryCards');
        if (!container) return;
        container.innerHTML = '';
        if (!Array.isArray(results) || results.length === 0) {
            showError('No results returned.');
            return;
        }
        for (var i = 0; i < results.length; i++) {
            var r = results[i];
            var card = document.createElement('div');
            card.className = 'card p-3';
            card.innerHTML = '<div class="fw-semibold">' + (r.programmeName || '') + '</div>' +
                '<div class="text-muted small mb-2">' + (r.faculty || '') + '</div>' +
                '<div class="d-flex flex-column gap-1">' +
                '<div><strong>Total study cost:</strong> ' + formatRm(r.totalCost) + '</div>' +
                '<div><strong>Expected earnings (5 yrs):</strong> ' + formatRm(r.earnings5yr) + '</div>' +
                '<div><strong>5-year ROI:</strong> ' + (r.roi5yrPercent != null ? formatPct(r.roi5yrPercent) : '-') + '</div>' +
                '<div><strong>Payback period:</strong> ' + (r.paybackYears != null ? (r.paybackYears + ' years') : '-') + '</div>' +
                '</div>';
            container.appendChild(card);
        }

        var ctxEl = document.getElementById('roiChart');
        if (!ctxEl) return;
        var ctx = ctxEl.getContext('2d');
        if (!ctx) return;
        if (roiChart && typeof roiChart.destroy === 'function') roiChart.destroy();

        var labels = results.map(function (x) { return x.programmeName; });
        var totalCosts = results.map(function (x) { return x.totalCost || 0; });
        var earnings = results.map(function (x) { return x.earnings5yr || 0; });

        roiChart = new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [
                { label: 'Total study cost (RM)', data: totalCosts, backgroundColor: 'rgba(54, 162, 235, 0.7)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 },
                { label: 'Expected earnings (5 yrs) (RM)', data: earnings, backgroundColor: 'rgba(75, 192, 192, 0.7)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }
            ] },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 15, boxHeight: 15 } },
                    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 10, cornerRadius: 4 }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'RM ' + Number(value).toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        var resultsPanel = document.getElementById('roiResults');
        if (resultsPanel) resultsPanel.style.display = 'block';
    }

    function handleGetRoi() {
        var livingInput = document.getElementById('livingCost');
        var living = safeNumber(livingInput && livingInput.value);
        var scholarship = safeNumber(document.getElementById('scholarshipTotal') && document.getElementById('scholarshipTotal').value);
        var partTime = safeNumber(document.getElementById('partTimeIncome') && document.getElementById('partTimeIncome').value);

        var livingError = document.getElementById('livingCostError');
        if (livingError) livingError.innerText = '';
        if (isNaN(living) || living < 0) {
            if (livingError) livingError.innerText = 'Please enter a valid non-negative monthly living cost.';
            return;
        }

        var programmes = getSelectedProgrammes();
        var body = {
            userFinancial: {
                livingCostPerMonth: living,
                scholarshipTotal: scholarship,
                partTimeIncomePerMonth: partTime
            },
            programmes: programmes.map(function (p) {
                return {
                    programmeCode: p.programmeCode,
                    programmeName: p.programmeName,
                    faculty: p.faculty,
                    tuitionTotal: p.tuitionTotal,
                    durationYears: p.durationYears
                };
            })
        };

        var btn = document.getElementById('getRoiBtn');
        if (btn) btn.disabled = true;

        fetch('/api/roi/calculate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        }).then(function (res) {
            if (!res.ok) return res.json().then(function (e) { throw e; });
            return res.json();
        }).then(function (data) {
            renderRoiResults(data.results || []);
        })['catch'](function (err) {
            console.error('ROI API error', err);
            showError('Could not calculate ROI at this time. Please try again later.');
        })['finally'](function () {
            if (btn) btn.disabled = false;
        });
    }

    // Init
    document.addEventListener('DOMContentLoaded', function () {
        fetchProgrammesFromServer().then(function () {
            populateProgramSelect();
        });
        var getBtn = document.getElementById('getRoiBtn');
        if (getBtn) getBtn.addEventListener('click', handleGetRoi);
        var resetBtn = document.getElementById('resetRoiBtn');
        if (resetBtn) resetBtn.addEventListener('click', function () {
            var form = document.getElementById('roiForm'); if (form) form.reset();
            var results = document.getElementById('roiResults'); if (results) results.style.display = 'none';
            var cards = document.getElementById('roiSummaryCards'); if (cards) cards.innerHTML = '';
            if (roiChart && typeof roiChart.destroy === 'function') { roiChart.destroy(); roiChart = null; }
        });
    });

})();
// --- Only use API to populate dropdown ---
function fetchAndPopulateFaculties() {
    fetch('/api/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var faculties = {};
            data.forEach(function (p) {
                if (p.faculty) faculties[p.faculty] = true;
            });
            var fieldSelect = document.getElementById('field');
            if (!fieldSelect) return;
            fieldSelect.innerHTML = '';
            Object.keys(faculties).forEach(function (faculty) {
                var pureName = faculty.replace(/^(Faculty|Academy|Academic) of\s*/i, '');
                var opt = document.createElement('option');
                opt.value = pureName;
                opt.textContent = pureName;
                fieldSelect.appendChild(opt);
            });
        });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchAndPopulateFaculties();
});

// --- Predefined career forecast data by field ---
var predefinedCareerConfig = {
    "Computer Science": {
        displayName: "Computer Science",
        typicalJobs: ["Software Engineer", "UI/UX Designer", "Data Analyst", "Business Analyst", "Web Developer", "System Administrator"],
        sectorDistribution: [
            { label: "IT & Software", value: 60 },
            { label: "Finance", value: 15 },
            { label: "Education", value: 10 },
            { label: "Others", value: 15 }
        ],
        careerPath: [
            { year: 0, level: "Entry", salaryFactor: 1.0 },
            { year: 3, level: "Mid", salaryFactor: 1.5 },
            { year: 7, level: "Senior", salaryFactor: 2.2 }
        ],
        entrySalaryBaselineRm: 35000
    },
    "Engineering": {
        displayName: "Engineering",
        typicalJobs: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Project Manager", "Site Supervisor"],
        sectorDistribution: [
            { label: "Construction", value: 50 },
            { label: "Manufacturing", value: 30 },
            { label: "Consulting", value: 10 },
            { label: "Others", value: 10 }
        ],
        careerPath: [
            { year: 0, level: "Entry", salaryFactor: 1.0 },
            { year: 5, level: "Mid", salaryFactor: 1.7 },
            { year: 10, level: "Senior", salaryFactor: 2.5 }
        ],
        entrySalaryBaselineRm: 32000
    },
    "Business and Economics": {
        displayName: "Business and Economics",
        typicalJobs: ["Accountant", "Financial Analyst", "Marketing Executive", "Business Consultant", "HR Specialist"],
        sectorDistribution: [
            { label: "Finance", value: 40 },
            { label: "Consulting", value: 25 },
            { label: "Marketing", value: 20 },
            { label: "Others", value: 15 }
        ],
        careerPath: [
            { year: 0, level: "Entry", salaryFactor: 1.0 },
            { year: 4, level: "Mid", salaryFactor: 1.4 },
            { year: 8, level: "Senior", salaryFactor: 2.0 }
        ],
        entrySalaryBaselineRm: 30000
    },
    "Education": {
        displayName: "Education",
        typicalJobs: ["Teacher", "Lecturer", "Education Consultant", "Curriculum Developer"],
        sectorDistribution: [
            { label: "Schools", value: 60 },
            { label: "Colleges", value: 25 },
            { label: "Consulting", value: 10 },
            { label: "Others", value: 5 }
        ],
        careerPath: [
            { year: 0, level: "Entry", salaryFactor: 1.0 },
            { year: 6, level: "Mid", salaryFactor: 1.3 },
            { year: 12, level: "Senior", salaryFactor: 1.8 }
        ],
        entrySalaryBaselineRm: 28000
    },
    "Science": {
        displayName: "Science",
        typicalJobs: ["Researcher", "Lab Technician", "Environmental Consultant", "Quality Analyst"],
        sectorDistribution: [
            { label: "Research", value: 50 },
            { label: "Industry", value: 30 },
            { label: "Education", value: 15 },
            { label: "Others", value: 5 }
        ],
        careerPath: [
            { year: 0, level: "Entry", salaryFactor: 1.0 },
            { year: 5, level: "Mid", salaryFactor: 1.3 },
            { year: 10, level: "Senior", salaryFactor: 1.7 }
        ],
        entrySalaryBaselineRm: 29000
    }
    // Add more fields as needed
};

function autoGenerateCareerConfig(fieldName) {
    // Use consistent color palette and realistic job names
    var jobTemplates = [
        ["Specialist", "Consultant", "Analyst", "Manager", "Coordinator"],
        ["Technician", "Developer", "Designer", "Researcher", "Officer"],
        ["Executive", "Advisor", "Strategist", "Planner", "Supervisor"]
    ];
    var sectorTemplates = [
        ["Industry", "Consulting", "Education", "Government", "Others"],
        ["Services", "Technology", "Finance", "Healthcare", "Others"],
        ["Production", "Operations", "Support", "Sales", "Others"]
    ];
    var baseColors = [
        '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    // Pick template based on hash of fieldName
    var hash = fieldName.split('').reduce(function(a, b) { return a + b.charCodeAt(0); }, 0);
    var jobSet = jobTemplates[hash % jobTemplates.length];
    var sectorSet = sectorTemplates[hash % sectorTemplates.length];
    var jobs = jobSet.map(function(j) { return fieldName + ' ' + j; });
    var sectors = sectorSet.map(function(s, i) {
        return { label: s, value: i === sectorSet.length - 1 ? 10 : 22 }; // last is 'Others'
    });
    sectors[0].value = 34; // main sector
    sectors[1].value = 22;
    sectors[2].value = 22;
    sectors[3].value = 12;
    sectors[4].value = 10;
    var careerPath = [
        { year: 0, level: "Entry", salaryFactor: 1.0 },
        { year: 4, level: "Mid", salaryFactor: 1.4 },
        { year: 8, level: "Senior", salaryFactor: 2.0 }
    ];
    var entrySalary = 28000 + (hash % 8000);
    return {
        displayName: fieldName,
        typicalJobs: jobs,
        sectorDistribution: sectors,
        careerPath: careerPath,
        entrySalaryBaselineRm: entrySalary
    };
}

window.showCareerForecast = function () {
    var fieldSelect = document.getElementById('field');
    var selectedField = fieldSelect ? fieldSelect.value : null;
    if (!selectedField) return;
    var config = predefinedCareerConfig[selectedField] || autoGenerateCareerConfig(selectedField);
    var tagsContainer = document.getElementById('tagsContainer');
    var careerResults = document.getElementById('careerResults');
    if (tagsContainer && config.typicalJobs) {
        tagsContainer.innerHTML = '';
        config.typicalJobs.forEach(function (job) {
            var tag = document.createElement('span');
            tag.className = 'badge bg-info text-dark';
            tag.textContent = job;
            tagsContainer.appendChild(tag);
        });
        if (careerResults) careerResults.style.display = 'block';
    }
    var pieContainer = document.getElementById('employmentPieChartContainer');
    var pieCanvas = document.getElementById('employmentPieChart');
    if (pieContainer && pieCanvas && config.sectorDistribution) {
        pieContainer.style.display = 'block';
        pieCanvas.width = 480;
        pieCanvas.height = 320;
        pieContainer.style.margin = '0 auto 32px auto';
        var pieLabels = config.sectorDistribution.map(function (x) { return x.label; });
        var pieData = config.sectorDistribution.map(function (x) { return x.value; });
        if (window.careerPieChart && typeof window.careerPieChart.destroy === 'function') window.careerPieChart.destroy();
        window.careerPieChart = new Chart(pieCanvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: pieLabels,
                datasets: [{
                    data: pieData,
                    backgroundColor: [
                        '#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 1.5,
                layout: { padding: 24 },
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 16 } } }
                }
            }
        });
    }
    var lineContainer = document.getElementById('careerLineChartContainer');
    var lineCanvas = document.getElementById('careerLineChart');
    if (lineContainer && lineCanvas && config.careerPath) {
        lineContainer.style.display = 'block';
        lineCanvas.width = 480;
        lineCanvas.height = 320;
        lineContainer.style.margin = '0 auto 32px auto';
        var years = config.careerPath.map(function (x) { return x.year; });
        var salaries = config.careerPath.map(function (x) {
            return Math.round(config.entrySalaryBaselineRm * x.salaryFactor);
        });
        var levels = config.careerPath.map(function (x) { return x.level; });
        if (window.careerLineChart && typeof window.careerLineChart.destroy === 'function') window.careerLineChart.destroy();
        window.careerLineChart = new Chart(lineCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Estimated Annual Salary (RM)',
                    data: salaries,
                    fill: false,
                    borderColor: '#36A2EB',
                    backgroundColor: '#36A2EB',
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: '#36A2EB',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                aspectRatio: 1.5,
                layout: { padding: 24 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: function (ctx) {
                                var idx = ctx[0].dataIndex;
                                return levels[idx] + ' (' + years[idx] + ' yrs)';
                            },
                            label: function (ctx) {
                                return 'RM ' + ctx.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Years after graduation' },
                        ticks: { font: { size: 14 } }
                    },
                    y: {
                        title: { display: true, text: 'Annual Salary (RM)' },
                        beginAtZero: true,
                        ticks: { font: { size: 14 } }
                    }
                }
            }
        });
    }
};

