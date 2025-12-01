const fs = require('fs').promises;
const path = require('path');

const PROGRAM_CSV = path.join(__dirname, '..', 'data', 'ProgramRequirements_names_skeleton_v2.csv');

function parseRow(line, cols) {
    const parts = line.split(',');
    const obj = {};
    for (let i = 0; i < cols.length; i++) {
        obj[cols[i]] = (parts[i] || '').trim();
    }
    return obj;
}

function toNormalizedProgram(r) {
    return {
        programme_code: r.programme_code || r.programmeCode || null,
        programme_name: r.programme_name || r.programmeName || null,
        faculty: r.faculty || null,
        tuition_total: r.tuition_total ? Number(r.tuition_total) : (r.tuitionTotal ? Number(r.tuitionTotal) : null),
        duration_years: r.duration_years ? Number(r.duration_years) : (r.durationYears ? Number(r.durationYears) : null)
    };
}

async function loadPrograms() {
    const raw = await fs.readFile(PROGRAM_CSV, 'utf8');
    const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');
    const header = lines.shift();
    const cols = header.split(',').map(c => c.trim());
    const programs = lines.map(line => {
        const row = parseRow(line, cols);
        return toNormalizedProgram(row);
    });
    return programs;
}

exports.getProgrammes = async (req, res) => {
    try {
        console.log('getProgrammes called, loading from:', PROGRAM_CSV);
        const programs = await loadPrograms();
        console.log('Loaded', programs.length, 'programmes');
        // return only basic fields for frontend
        const minimal = programs.map(p => ({
            programmeCode: p.programme_code,
            programmeName: p.programme_name,
            faculty: p.faculty,
            tuitionTotal: p.tuition_total,
            durationYears: p.duration_years
        }));
        console.log('Returning', minimal.length, 'minimal programmes');
        res.json(minimal);
    } catch (err) {
        console.error('Failed to load programmes CSV:', err.message || err);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: 'Failed to load programmes: ' + (err.message || String(err)) });
    }
};
