const fs = require('fs').promises;
const path = require('path');

const BASELINE_CSV = path.join(__dirname, '..', 'data', 'faculty_employability_baseline.csv');
const DEFAULT_EMPLOYMENT_RATE = 0.94;

let baselineMap = null; // faculty (lowercase trimmed) => { baselineAnnualSalaryRm, employmentRate, roiGroup }

function parseCsv(raw) {
    const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');
    const header = lines.shift();
    const cols = header.split(',').map(c => c.trim());
    const rows = lines.map(line => {
        const parts = line.split(',');
        const obj = {};
        for (let i = 0; i < cols.length; i++) obj[cols[i]] = (parts[i] || '').trim();
        return obj;
    });
    return rows;
}

async function loadBaseline() {
    try {
        const raw = await fs.readFile(BASELINE_CSV, 'utf8');
        const rows = parseCsv(raw);
        baselineMap = {};
        rows.forEach(r => {
            const facultyKey = (r.faculty || '').toLowerCase().trim();
            baselineMap[facultyKey] = {
                baselineAnnualSalaryRm: Number(r.baseline_annual_salary_rm) || 0,
                employmentRate: Number(r.employment_rate) || DEFAULT_EMPLOYMENT_RATE,
                roiGroup: r.roi_group || null
            };
        });
        console.log(`ROI baseline: loaded ${Object.keys(baselineMap).length} faculties`);
        return baselineMap;
    } catch (err) {
        console.error('Failed to load ROI baseline CSV:', err.message || err);
        throw err;
    }
}

function getFacultyBaseline(facultyName) {
    if (!baselineMap) return null;
    if (!facultyName) return null;
    return baselineMap[facultyName.toLowerCase().trim()] || null;
}

function computeROIForProgramme(prog, userFinancial) {
    const tuitionTotal = Number(prog.tuitionTotal || prog.tuition_total || 0) || 0;
    const durationYears = Number(prog.durationYears || prog.duration_years || prog.duration || 0) || 0;
    const faculty = prog.faculty || prog.faculty_name || '';

    const livingCostPerMonth = Number(userFinancial.livingCostPerMonth || 0) || 0;
    const scholarshipTotal = Number(userFinancial.scholarshipTotal || 0) || 0;
    const partTimeIncomePerMonth = Number(userFinancial.partTimeIncomePerMonth || 0) || 0;

    const livingTotal = livingCostPerMonth * 12 * durationYears;
    const partTimeTotal = partTimeIncomePerMonth * 12 * durationYears;
    const totalCost = tuitionTotal + livingTotal - scholarshipTotal - partTimeTotal;

    const baseline = getFacultyBaseline(faculty) || {};
    const baselineAnnualSalary = baseline.baselineAnnualSalaryRm || 0;
    const employmentRate = (typeof baseline.employmentRate === 'number' ? baseline.employmentRate : DEFAULT_EMPLOYMENT_RATE) || DEFAULT_EMPLOYMENT_RATE;
    const roiGroup = baseline.roiGroup || null;

    const effectiveAnnualEarnings = baselineAnnualSalary * employmentRate;
    const earnings5yr = 5 * effectiveAnnualEarnings;

    let roi5yrPercent = null;
    if (totalCost !== 0) {
        roi5yrPercent = ((earnings5yr - totalCost) / (totalCost)) * 100;
    }

    let paybackYears = null;
    if (effectiveAnnualEarnings > 0) {
        paybackYears = totalCost / effectiveAnnualEarnings;
    }

    return {
        programmeCode: (prog.programmeCode || prog.programme_code) || null,
        programmeName: (prog.programmeName || prog.programme_name) || null,
        faculty: faculty,
        totalCost: Number(Number(totalCost).toFixed(2)),
        earnings5yr: Number(Number(earnings5yr).toFixed(2)),
        roi5yrPercent: roi5yrPercent == null ? null : Number(Number(roi5yrPercent).toFixed(2)),
        paybackYears: paybackYears == null ? null : Number(Number(paybackYears).toFixed(2)),
        baselineAnnualSalary: Number(baselineAnnualSalary),
        employmentRate: Number(employmentRate),
        roiGroup: roiGroup
    };
}

function computeROI(userFinancial, programmes) {
    if (!Array.isArray(programmes)) programmes = [];
    const results = programmes.map(p => computeROIForProgramme(p, userFinancial));
    return results;
}

module.exports = {
    loadBaseline,
    computeROI,
    getFacultyBaseline,
    DEFAULT_EMPLOYMENT_RATE
};
