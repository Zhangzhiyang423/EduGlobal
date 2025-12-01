// controllers/recommendationController.js
// Implements rule-based filtering and an explainable AI-style ranking model

const fs = require('fs');
const path = require('path');

// Path to the program requirements CSV (use the provided dataset)
const PROGRAM_CSV = path.join(__dirname, '..', 'data', 'ProgramRequirements_names_skeleton_v2.csv');

// ---------- CSV parsing / normalization helpers ----------
function parseValue(v, columnName) {
    if (v == null) return null;
    let s = String(v).trim();
    if (s === '' || s.toUpperCase() === 'NA') return null;
    
    // Numeric columns: treat TRUE/FALSE as null (placeholder), not boolean
    const numericColumns = [
        'min_avg_shsc_pct', 'min_cgpa_foundation', 'min_cgpa_diploma', 'min_a_level_band',
        'min_ib_points', 'min_atar', 'min_muet_band', 'min_ielts_score', 'min_toefl_score',
        'min_pte_score', 'min_cambridge_level', 'duration_years', 'tuition_total'
    ];
    
    if (numericColumns.includes(columnName) && /^(TRUE|FALSE)$/i.test(s)) {
        return null; // Skip TRUE/FALSE in numeric columns
    }
    
    // Boolean columns: parse TRUE/FALSE properly
    const booleanColumns = [
        'requires_science_stream', 'requires_business_stream', 'requires_math', 'requires_two_science',
        'prefers_cs_subject', 'requires_language_subject', 'requires_sports_background', 
        'needs_interview', 'needs_portfolio_or_audition', 'not_suitable_colour_blind', 'needs_sport_evidence', 'needs_medical_check'
    ];
    
    if (booleanColumns.includes(columnName)) {
        if (/^TRUE$/i.test(s)) return true;
        if (/^FALSE$/i.test(s)) return false;
    }
    
    // percent like "65%"
    const pct = s.match(/^([0-9]+(\.[0-9]+)?)%$/);
    if (pct) return parseFloat(pct[1]);
    // numeric
    if (!isNaN(s)) return parseFloat(s);
    // otherwise string
    return s;
}

async function loadProgramsFromCSV() {
    const raw = await fs.promises.readFile(PROGRAM_CSV, 'utf8');
    const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== '');
    const header = lines.shift();
    const cols = header.split(',').map((c) => c.trim());

    const programs = lines.map((line) => {
        // naive split by comma (dataset is fairly regular)
        const parts = line.split(',');
        const row = {};
        for (let i = 0; i < cols.length; i++) {
            row[cols[i]] = parseValue(parts[i], cols[i]); // pass column name for context
        }
        // normalize some field names for easier use
        return normalizeProgramRow(row);
    });

    return programs;
}

function normalizeProgramRow(r) {
    const p = {
        programme_code: r.programme_code,
        programme_name: r.programme_name,
        faculty: r.faculty,
        field_group: r.field_group,
        duration_years: typeof r.duration_years === 'number' ? r.duration_years : null,
        tuition_total: typeof r.tuition_total === 'number' ? r.tuition_total : null,

        // academic minima (may be null)
        min_avg_shsc_pct: typeof r.min_avg_shsc_pct === 'number' ? r.min_avg_shsc_pct : null,
        min_cgpa_foundation: typeof r.min_cgpa_foundation === 'number' ? r.min_cgpa_foundation : null,
        min_cgpa_diploma: typeof r.min_cgpa_diploma === 'number' ? r.min_cgpa_diploma : null,
        min_a_level_band: typeof r.min_a_level_band === 'number' ? r.min_a_level_band : null,
        min_ib_points: typeof r.min_ib_points === 'number' ? r.min_ib_points : null,
        min_atar: typeof r.min_atar === 'number' ? r.min_atar : null,

        // stream / subject requirements
        requires_science_stream: !!r.requires_science_stream,
        requires_business_stream: !!r.requires_business_stream,
        requires_math: !!r.requires_math,
        requires_two_science: !!r.requires_two_science,
        prefers_cs_subject: !!r.prefers_cs_subject,
        requires_language_subject: !!r.requires_language_subject,

        // English minima
        min_muet_band: typeof r.min_muet_band === 'number' ? r.min_muet_band : null,
        min_ielts_score: typeof r.min_ielts_score === 'number' ? r.min_ielts_score : null,
        min_toefl_score: typeof r.min_toefl_score === 'number' ? r.min_toefl_score : null,
        min_pte_score: typeof r.min_pte_score === 'number' ? r.min_pte_score : null,
        min_cambridge_level: typeof r.min_cambridge_level === 'number' ? r.min_cambridge_level : null,

        // special flags
        requires_sports_background: !!r.requires_sports_background || !!r.needs_sport_evidence,
        needs_interview: !!r.needs_interview,
        needs_portfolio_or_audition: !!r.needs_portfolio_or_audition
    };

    // derive tuition per year if possible
    if (p.tuition_total != null) {
        if (p.duration_years && p.duration_years > 0) p.tuition_per_year = p.tuition_total / p.duration_years;
        else p.tuition_per_year = p.tuition_total / 3; // default 3-year approximation
    } else {
        p.tuition_per_year = null;
    }

    return p;
}

// ---------- User normalization ----------
function normalizeUserInput(body) {
    // accept both snake_case and camelCase
    const get = (k1, k2) => body[k1] ?? body[k2];

    // Try to derive a numeric result when possible
    const overallRaw = get('overall_result_raw', 'overallResult') || get('resultRaw', 'result_raw') || '';
    let resultNumeric = null;
    if (overallRaw != null) {
        const s = String(overallRaw).trim();
        const numMatch = s.match(/([0-9]+(\.[0-9]+)?)/);
        if (numMatch) resultNumeric = parseFloat(numMatch[1]);
    }

    return {
        qualificationType: get('qualification_type', 'qualificationType') || null,
        resultNumeric: get('result_numeric', 'resultNumeric') ?? resultNumeric,
        streamType: get('stream_type', 'streamType') || null,
        subjectFlags: get('subject_flags', 'subjectFlags') || {},
        englishTestType: get('english_test_type', 'englishTestType') || null,
        englishScore: get('english_score', 'englishScore') ?? null,
        preferredFields: get('preferred_fields', 'preferredFields') || [],
        sportsInvolvement: get('sports_involvement', 'sportsInvolvement') || get('sports_involvement', 'sportsInvolvement') || get('sportsInvolvement','sportsInvolvement') || 'no',
        okForInterviewPortfolio: get('ok_for_interview_portfolio', 'okForInterviewPortfolio') || get('interviewPortfolio','interviewPortfolio') || 'yes',
        budgetPerYear: get('budget_per_year', 'budgetPerYear') ?? null
    };
}

// ---------- Rule-based filters (pure functions) ----------
// Check academic minima depending on qualification type
function meetsAcademicRequirement(user, program) {
    const q = (user.qualificationType || '').toLowerCase();
    const v = user.resultNumeric != null ? Number(user.resultNumeric) : null;

    if (v == null) {
        // no numeric result provided -> cannot strictly enforce, allow through but mark as borderline
        return true;
    }

    if (q === 'foundation' || q === 'matriculation' || q === 'stpm') {
        if (program.min_cgpa_foundation != null) return v >= program.min_cgpa_foundation;
    }
    if (q === 'diploma' || q === 'diploma_other') {
        if (program.min_cgpa_diploma != null) return v >= program.min_cgpa_diploma;
    }
    if (q === 'a_level' || q === 'a-level') {
        if (program.min_a_level_band != null) return v >= program.min_a_level_band;
    }
    if (q === 'ib') {
        if (program.min_ib_points != null) return v >= program.min_ib_points;
    }
    if (q === 'ausmat_atar' || q === 'atar' || q === 'ausmat') {
        if (program.min_atar != null) return v >= program.min_atar;
    }
    if (q === 'highschool_other' || q === 'uec' || q === 'senior high school') {
        if (program.min_avg_shsc_pct != null) return v >= program.min_avg_shsc_pct;
    }

    // if program has no relevant numeric minimum, consider it pass
    return true;
}

function meetsEnglishRequirement(user, program) {
    const test = (user.englishTestType || '').toLowerCase();
    const score = user.englishScore != null ? Number(user.englishScore) : null;

    if (score == null) {
        // No score provided: do NOT hard-filter programs out just because an English minimum exists.
        // Instead allow the programme through and let the ranking model penalize missing English scores.
        return true;
    }

    if (test === 'muet' && program.min_muet_band != null) return score >= program.min_muet_band;
    if ((test === 'ielts' || test === 'ielts_academic') && program.min_ielts_score != null) return score >= program.min_ielts_score;
    if ((test === 'toefl' || test === 'toefl_ibt') && program.min_toefl_score != null) return score >= program.min_toefl_score;
    if (test === 'pte' && program.min_pte_score != null) return score >= program.min_pte_score;
    if ((test === 'cambridge' || test === 'cambridge english') && program.min_cambridge_level != null) return score >= program.min_cambridge_level;

    // if programme has no specific requirement for the test, allow
    return true;
}

function meetsHardSpecialRequirements(user, program) {
    // sports requirement: HARD FILTER — must have sports involvement
    if (program.requires_sports_background && (user.sportsInvolvement || '').toLowerCase() !== 'yes') {
        return false;
    }

    // subject requirements: HARD FILTERS for critical subjects
    // if programme requires mathematics, user must have taken math
    if (program.requires_math && !(user.subjectFlags && user.subjectFlags.has_math)) {
        return false;
    }

    // if programme requires two science subjects, user must have them
    if (program.requires_two_science && !(user.subjectFlags && user.subjectFlags.has_two_science)) {
        return false;
    }

    // if programme requires science stream, user must be from science stream
    if (program.requires_science_stream && user.streamType !== 'science_technical') {
        return false;
    }

    // if programme requires business stream, user must be from business stream
    if (program.requires_business_stream && user.streamType !== 'business') {
        return false;
    }

    // interview/portfolio: soft constraint — allow through but score lower if unwilling
    // (do not hard-filter on this)

    return true;
}

// ---------- Feature computations (pure, explainable) ----------
function computeFeatureVector(user, program) {
    const f = {};

    // Academic fit: compute normalized surplus over minimum (0..1)
    f.academic_fit = computeAcademicFit(user, program);

    // Interest fit: match user preferred fields against programme.field_group
    if (Array.isArray(user.preferredFields) && user.preferredFields.length > 0) {
        f.interest_fit = user.preferredFields.includes(program.field_group) ? 1.0 : 0.0;
    } else {
        f.interest_fit = 0.5; // neutral when unknown
    }

    // Stream fit
    if (program.requires_science_stream) {
        f.stream_fit = user.streamType === 'science_technical' ? 1.0 : 0.0;
    } else if (program.requires_business_stream) {
        f.stream_fit = user.streamType === 'business' ? 1.0 : 0.0;
    } else {
        f.stream_fit = 1.0;
    }

    // Subject fit: average of required subject matches
    const subjectChecks = [];
    if (program.requires_math) subjectChecks.push(!!(user.subjectFlags && user.subjectFlags.has_math));
    if (program.requires_two_science) subjectChecks.push(!!(user.subjectFlags && user.subjectFlags.has_two_science));
    if (program.prefers_cs_subject) subjectChecks.push(!!(user.subjectFlags && user.subjectFlags.has_cs_subject));
    if (program.requires_language_subject) subjectChecks.push(!!(user.subjectFlags && user.subjectFlags.has_foreign_language));
    if (subjectChecks.length === 0) f.subject_fit = 0.7; else f.subject_fit = subjectChecks.reduce((s, v) => s + (v ? 1 : 0), 0) / subjectChecks.length;

    // English fit: normalized surplus over minimum for the chosen test
    f.english_fit = computeEnglishFit(user, program);

    // Financial fit: compare user's budget per year to tuition_per_year
    if (user.budgetPerYear && program.tuition_per_year) {
        const ratio = Number(user.budgetPerYear) / Number(program.tuition_per_year);
        f.financial_fit = Math.max(0, Math.min(1, ratio));
    } else {
        f.financial_fit = 0.7;
    }

    // Sports fit
    if (program.requires_sports_background) {
        f.sports_fit = (user.sportsInvolvement || '').toLowerCase() === 'yes' ? 1.0 : 0.0;
    } else {
        f.sports_fit = 1.0;
    }

    // Interview fit
    if (program.needs_interview || program.needs_portfolio_or_audition) {
        f.interview_fit = (user.okForInterviewPortfolio || '').toLowerCase() === 'yes' ? 1.0 : 0.0;
    } else {
        f.interview_fit = 1.0;
    }

    return f;
}

function computeAcademicFit(user, program) {
    const v = user.resultNumeric != null ? Number(user.resultNumeric) : null;
    if (v == null) return 0.5; // unknown

    // choose the most relevant minimum by qualification
    const q = (user.qualificationType || '').toLowerCase();
    let min = null;
    let max = null;
    if (q === 'foundation' || q === 'matriculation' || q === 'stpm') {
        min = program.min_cgpa_foundation; max = 4.0;
    } else if (q === 'diploma') {
        min = program.min_cgpa_diploma; max = 4.0;
    } else if (q === 'a_level' || q === 'a-level') {
        min = program.min_a_level_band; max = 45; // approximate
    } else if (q === 'ib') {
        min = program.min_ib_points; max = 45;
    } else if (q === 'ausmat_atar' || q === 'atar' || q === 'ausmat') {
        min = program.min_atar; max = 100;
    } else {
        min = program.min_avg_shsc_pct; max = 100;
    }

    if (min == null) return 0.6; // no hard minimum available -> slightly positive

    if (v < min) return 0.0;
    // normalized surplus
    const score = (v - min) / Math.max(1e-6, (max - min));
    return Math.max(0, Math.min(1, score));
}

function computeEnglishFit(user, program) {
    const test = (user.englishTestType || '').toLowerCase();
    const s = user.englishScore != null ? Number(user.englishScore) : null;
    // pick relevant minimum
    let min = null;
    if (test === 'muet') min = program.min_muet_band;
    else if (test === 'ielts' || test === 'ielts_academic') min = program.min_ielts_score;
    else if (test === 'toefl' || test === 'toefl_ibt') min = program.min_toefl_score;
    else if (test === 'pte') min = program.min_pte_score;
    else if (test === 'cambridge') min = program.min_cambridge_level;

    if (s == null) {
        // no score provided
        return min == null ? 0.7 : 0.0;
    }

    if (min == null) return 0.8; // programme doesn't declare a min for this test

    if (s < min) return 0.0;
    // normalize with reasonable maxima per test
    const maxima = { muet: 6, ielts: 9, toefl: 120, pte: 90, cambridge: 210 };
    const key = test.split(/\s|_/)[0];
    const max = maxima[key] || (min + 4);
    const score = (s - min) / Math.max(1e-6, (max - min));
    return Math.max(0, Math.min(1, score));
}

// ---------- Scoring model (weights are explainable and deterministic) ----------
function computeScoreTotal(feat) {
    const weights = {
        academic_fit: 0.30,
        interest_fit: 0.25,
        stream_fit: 0.10,
        subject_fit: 0.10,
        english_fit: 0.10,
        financial_fit: 0.10,
        sports_fit: 0.025,
        interview_fit: 0.025
    };

    let total = 0;
    for (const k of Object.keys(weights)) {
        total += (feat[k] || 0) * weights[k];
    }
    return { score_total: Math.max(0, Math.min(1, total)), weights };
}

// ---------- Main handler ----------
exports.getRecommendations = async (req, res) => {
    const rawUser = req.body || {};
    const user = normalizeUserInput(rawUser);

    console.log('\n=== RECOMMENDATION REQUEST ===');
    console.log('User Input:', JSON.stringify(user, null, 2));

    try {
        const programs = await loadProgramsFromCSV();
        console.log(`Total programmes in CSV: ${programs.length}`);

        // 1) Apply rule-based filters
        const filtered = programs.filter((p) => {
            try {
                const pass = meetsAcademicRequirement(user, p) && meetsEnglishRequirement(user, p) && meetsHardSpecialRequirements(user, p);
                if (!pass) {
                    const reasons = [];
                    if (!meetsAcademicRequirement(user, p)) reasons.push('academic');
                    if (!meetsEnglishRequirement(user, p)) reasons.push('english');
                    if (!meetsHardSpecialRequirements(user, p)) reasons.push('special');
                    console.log(`  ✗ ${p.programme_code} (${p.programme_name}): filtered out [${reasons.join(',')}]`);
                }
                return pass;
            } catch (e) {
                console.log(`  ✗ ${p.programme_code}: error during filter:`, e.message);
                return false;
            }
        });

        console.log(`\nProgrammes passing filters: ${filtered.length}`);

        // 2) Compute features and scores
        const scored = filtered.map((p) => {
            const feats = computeFeatureVector(user, p);
            const { score_total } = computeScoreTotal(feats);
            console.log(`  ✓ ${p.programme_code} (${p.programme_name}): score ${(score_total * 100).toFixed(1)}% [academic ${(feats.academic_fit * 100).toFixed(0)}%, interest ${(feats.interest_fit * 100).toFixed(0)}%, stream ${(feats.stream_fit * 100).toFixed(0)}%, subject ${(feats.subject_fit * 100).toFixed(0)}%, english ${(feats.english_fit * 100).toFixed(0)}%, financial ${(feats.financial_fit * 100).toFixed(0)}%, sports ${(feats.sports_fit * 100).toFixed(0)}%, interview ${(feats.interview_fit * 100).toFixed(0)}%]`);
            return {
                programme_code: p.programme_code,
                programme_name: p.programme_name,
                faculty: p.faculty,
                field_group: p.field_group,
                tuition_total: p.tuition_total,
                tuition_per_year: p.tuition_per_year,
                score_total,
                score_breakdown: feats
            };
        });

        // 3) Sort by score descending
        scored.sort((a, b) => b.score_total - a.score_total);

        console.log(`\nTop 10 results (sorted):`);
        scored.slice(0, 10).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.programme_code} (${p.programme_name}): ${(p.score_total * 100).toFixed(1)}%`);
        });

        // 4) Return top 10
        res.json(scored.slice(0, 10));
    } catch (err) {
        console.error('Error in getRecommendations:', err);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};
