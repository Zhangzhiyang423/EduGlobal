const fs = require('fs');

const csv = fs.readFileSync('./data/ProgramRequirements_names_skeleton_v2.csv', 'utf8');
const lines = csv.split(/\r?\n/).filter(l => l.trim());
const header = lines.shift().split(',').map(c => c.trim());

// Find column indices
const nameIdx = header.indexOf('programme_name');
const fieldIdx = header.indexOf('field_group');
const minIeltsIdx = header.indexOf('min_ielts_score');
const minMuetIdx = header.indexOf('min_muet_band');
const scienceIdx = header.indexOf('requires_science_stream');
const mathIdx = header.indexOf('requires_math');

console.log('Sample programmes by category:\n');

['finance', 'computer science', 'arts'].forEach(keyword => {
    const match = lines.find(l => l.toLowerCase().includes(keyword));
    if(match) {
        const parts = match.split(',');
        console.log(`${keyword.toUpperCase()}:`);
        console.log(`  Name: ${parts[nameIdx]}`);
        console.log(`  Field: ${parts[fieldIdx]}`);
        console.log(`  Min IELTS: ${parts[minIeltsIdx]}`);
        console.log(`  Min MUET: ${parts[minMuetIdx]}`);
        console.log(`  Requires Science: ${parts[scienceIdx]}`);
        console.log(`  Requires Math: ${parts[mathIdx]}`);
        console.log();
    }
});

// Count programmes by field
console.log('\n\nProgrammes by field group:');
const counts = {};
lines.forEach(line => {
    const parts = line.split(',');
    const field = parts[fieldIdx];
    counts[field] = (counts[field] || 0) + 1;
});

Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([field, count]) => {
        console.log(`  ${field}: ${count}`);
    });
