// Depreciation calculation utilities

/**
 * Calculate depreciation for an asset
 * @param {Object} asset - Asset object with depreciation details
 * @returns {Object} Depreciation details 
 */
function calculateDepreciation(asset) {
    if (!asset.depreciationMethod || asset.depreciationMethod === '') {
        return {
            method: 'None',
            annualDepreciation: 0,
            accumulatedDepreciation: 0,
            bookValue: asset.currentValue || asset.purchaseValue || 0,
            depreciationRate: 0
        };
    }

    const purchaseValue = asset.purchaseValue || 0;
    const salvageValue = asset.salvageValue || 0;
    const usefulLife = asset.usefulLife || 1;

    // Calculate years since purchase
    const purchaseDate = new Date(asset.purchaseDate);
    const today = new Date();
    const yearsSincePurchase = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365);

    let annualDepreciation = 0;
    let accumulatedDepreciation = 0;
    let bookValue = purchaseValue;
    let depreciationRate = 0;

    if (asset.depreciationMethod === 'STRAIGHT_LINE') {
        // Straight Line: (Cost - Salvage) / Useful Life
        annualDepreciation = (purchaseValue - salvageValue) / usefulLife;
        accumulatedDepreciation = Math.min(annualDepreciation * yearsSincePurchase, purchaseValue - salvageValue);
        bookValue = purchaseValue - accumulatedDepreciation;
        depreciationRate = (annualDepreciation / purchaseValue) * 100;

    } else if (asset.depreciationMethod === 'REDUCING_BALANCE') {
        // Reducing Balance at 20% per year
        const rate = 0.20;
        bookValue = purchaseValue * Math.pow((1 - rate), yearsSincePurchase);
        bookValue = Math.max(bookValue, salvageValue);
        accumulatedDepreciation = purchaseValue - bookValue;
        annualDepreciation = bookValue * rate;
        depreciationRate = rate * 100;
    }

    return {
        method: asset.depreciationMethod,
        annualDepreciation: Math.round(annualDepreciation * 100) / 100,
        accumulatedDepreciation: Math.round(accumulatedDepreciation * 100) / 100,
        bookValue: Math.round(bookValue * 100) / 100,
        depreciationRate: Math.round(depreciationRate * 100) / 100,
        yearsSincePurchase: Math.round(yearsSincePurchase * 100) / 100
    };
}

/**
 * Format depreciation info for display
 * @param {Object} depInfo - Depreciation info from calculateDepreciation
 * @returns {string} Formatted HTML string
 */
function formatDepreciationInfo(depInfo) {
    if (depInfo.method === 'None') {
        return '<span style="color: var(--text-muted);">No depreciation</span>';
    }

    return `
        <div style="font-size: 0.85rem; line-height: 1.6;">
            <strong style="color: var(--primary);">${depInfo.method.replace('_', ' ')}</strong><br/>
            Annual: ₹${depInfo.annualDepreciation.toLocaleString()}/year (${depInfo.depreciationRate}%)<br/>
            Accumulated: ₹${depInfo.accumulatedDepreciation.toLocaleString()}<br/>
            Book Value: ₹${depInfo.bookValue.toLocaleString()}
        </div>
    `;
}
