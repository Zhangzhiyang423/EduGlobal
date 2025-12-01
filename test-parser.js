// Test the parseValue function with the actual implementation
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

// Test cases
console.log('Testing parseValue function:\n');

const testCases = [
    ['TRUE', 'requires_science_stream', 'should be TRUE (boolean)'],
    ['FALSE', 'requires_science_stream', 'should be FALSE (boolean)'],
    ['TRUE', 'min_ib_points', 'should be null (placeholder in numeric column)'],
    ['FALSE', 'min_a_level_band', 'should be null (placeholder in numeric column)'],
    ['30', 'min_ib_points', 'should be 30 (number)'],
    ['6', 'min_ielts_score', 'should be 6 (number)'],
    ['65%', 'min_avg_shsc_pct', 'should be 65 (percent)'],
];

testCases.forEach(([val, col, expected]) => {
    const result = parseValue(val, col);
    console.log(`parseValue("${val}", "${col}")`);
    console.log(`  Result: ${JSON.stringify(result)} (${typeof result})`);
    console.log(`  Expected: ${expected}\n`);
});
