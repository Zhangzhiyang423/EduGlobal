const roiService = require('../services/roiService');

exports.calculateROI = async (req, res) => {
    try {
        const body = req.body || {};
        const userFinancial = body.userFinancial || {};
        const programmes = body.programmes || [];

        // Basic validation
        if (!userFinancial || typeof userFinancial.livingCostPerMonth === 'undefined') {
            return res.status(400).json({ error: 'Missing userFinancial.livingCostPerMonth' });
        }

        const results = roiService.computeROI(userFinancial, programmes);
        res.json({ results });
    } catch (err) {
        console.error('Error in calculateROI:', err);
        res.status(500).json({ error: 'ROI calculation failed' });
    }
};
