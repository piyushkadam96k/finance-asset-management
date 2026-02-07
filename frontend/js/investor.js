async function loadInvestorData() {
    const portfolioBox = document.getElementById("portfolioBox");
    const table = document.getElementById("investorAssets");

    if (!portfolioBox || !table) return;

    try {
        showLoading();

        // Show skeleton loading state
        portfolioBox.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div class="skeleton" style="height: 120px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 120px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 120px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 120px; border-radius: 12px;"></div>
            </div>
        `;

        const [profile, summary, assets] = await Promise.all([
            apiRequest("/users/me"),
            apiRequest("/portfolio/summary/1"),
            apiRequest("/assets")
        ]);

        // Render portfolio summary with animation
        portfolioBox.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
                <div style="text-align: center; padding: 20px; background: rgba(99, 102, 241, 0.1); border-radius: 12px; transition: transform 0.3s ease; cursor: pointer;" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='translateY(0)'">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Total Assets</h4>
                    <p style="font-size: 2rem; font-weight: 700; margin: 8px 0; background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${summary?.totalAssets || 0}</p>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(20, 184, 166, 0.1); border-radius: 12px; transition: transform 0.3s ease; cursor: pointer;" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='translateY(0)'">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Total Value</h4>
                    <p style="font-size: 2rem; font-weight: 700; margin: 8px 0; background: linear-gradient(135deg, #4ade80 0%, #14b8a6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">₹${((summary?.totalValue || 0) / 10000000).toFixed(2)} Cr</p>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(236, 72, 153, 0.1); border-radius: 12px; transition: transform 0.3s ease; cursor: pointer;" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='translateY(0)'">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Investment</h4>
                    <p style="font-size: 2rem; font-weight: 700; margin: 8px 0; color: var(--text-primary);">₹${((summary?.totalInvestment || 0) / 10000000).toFixed(2)} Cr</p>
                </div>
                <div style="text-align: center; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; transition: transform 0.3s ease; cursor: pointer;" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='translateY(0)'">
                    <h4 style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">ROI</h4>
                    <p style="font-size: 2rem; font-weight: 700; margin: 8px 0; color: var(--success);">${summary?.roi || 0}%</p>
                </div>
            </div>
        `;

        // Render assets table
        table.innerHTML = "<thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Category</th><th>Quantity</th><th>Purchase Price</th><th>Current Value</th><th>Profit/Loss</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!assets || assets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">No assets in your portfolio</div><div class="empty-state-subtext">Contact your asset manager to add assets</div></td></tr>';
            return;
        }

        assets.forEach(a => {
            const row = document.createElement("tr");
            const pl = (a.currentValue || 0) - (a.purchasePrice || 0);
            const plColor = pl >= 0 ? 'var(--success)' : 'var(--danger)';
            const plIcon = pl >= 0 ? '↑' : '↓';

            row.innerHTML = `
                <td>${a.id || 'N/A'}</td>
                <td><strong>${a.assetCode || 'N/A'}</strong></td>
                <td>${a.name || 'N/A'}</td>
                <td><span class="badge badge-success">${a.category?.name || a.category || 'N/A'}</span></td>
                <td>${a.quantity || 0}</td>
                <td>₹${(a.purchasePrice || 0).toLocaleString()}</td>
                <td>₹${(a.currentValue || 0).toLocaleString()}</td>
                <td style="color: ${plColor}; font-weight: 600;">${plIcon} ${pl >= 0 ? '+' : ''}₹${pl.toLocaleString()}</td>
            `;

            // Add hover effect
            row.style.transition = 'all 0.2s ease';
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'scale(1.01)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'scale(1)';
            });

            tbody.appendChild(row);
        });

        showToast('Portfolio loaded successfully', 'success');

        // Calculate and display risk analysis
        calculateRiskAnalysis(assets, summary);

    } catch (err) {
        console.error("Failed to load investor data:", err);

        if (portfolioBox) {
            portfolioBox.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-text">Failed to load portfolio data</div>
                    <div class="empty-state-subtext">Please try refreshing the page</div>
                    <button onclick="location.reload()" style="margin-top: 20px; width: auto; padding: 12px 24px;">Refresh Page</button>
                </div>
            `;
        }

        if (table) {
            table.innerHTML = '<tr><td colspan="8" class="empty-state"><div class="empty-state-text">Failed to load assets</div></td></tr>';
        }
    } finally {
        hideLoading();
    }
}

// Refresh function
function refreshPortfolio() {
    loadInvestorData();
}

// Initialize on page load
if (document.getElementById("portfolioBox")) {
    // Add refresh button to header if not exists
    const header = document.querySelector('.topbar h2');
    if (header && !document.getElementById('refreshBtn')) {
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refreshBtn';
        refreshBtn.type = 'button';
        refreshBtn.textContent = '🔄 Refresh';
        refreshBtn.onclick = refreshPortfolio;
        refreshBtn.style.width = 'auto';
        refreshBtn.style.padding = '12px 24px';
        refreshBtn.style.marginLeft = '12px';
        header.parentElement.insertBefore(refreshBtn, header.nextSibling);
    }

    // Load data after a short delay
    setTimeout(() => {
        loadInvestorData();
    }, 100);
}

// Advanced Risk Analysis
function calculateRiskAnalysis(assets, summary) {
    const riskBox = document.getElementById("riskAnalysis");
    if (!riskBox || !assets || assets.length === 0) {
        if (riskBox) {
            riskBox.innerHTML = '<div class="empty-state-text">No data available for risk analysis</div>';
        }
        return;
    }

    // Calculate diversification
    const categoryCounts = {};
    let totalValue = 0;
    assets.forEach(a => {
        const cat = a.category?.name || 'Uncategorized';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        totalValue += (a.currentValue || 0);
    });

    const numCategories = Object.keys(categoryCounts).length;
    const diversificationScore = Math.min(100, (numCategories / 5) * 100); // 5+ categories = 100%

    // Calculate volatility (based on profit/loss variance)
    let totalPL = 0;
    let plVariance = 0;
    assets.forEach(a => {
        const pl = ((a.currentValue || 0) - (a.purchaseValue || 0)) / (a.purchaseValue || 1);
        totalPL += pl;
    });
    const avgPL = totalPL / assets.length;
    assets.forEach(a => {
        const pl = ((a.currentValue || 0) - (a.purchaseValue || 0)) / (a.purchaseValue || 1);
        plVariance += Math.pow(pl - avgPL, 2);
    });
    const volatility = Math.sqrt(plVariance / assets.length) * 100;
    const volatilityScore = Math.max(0, 100 - (volatility * 10)); // Lower volatility = higher score

    // Calculate overall risk score (0-100, higher = lower risk)
    const roi = summary.roi || 0;
    const roiScore = roi > 0 ? Math.min(100, roi * 2) : Math.max(0, 50 + roi);
    const riskScore = Math.round((diversificationScore * 0.4) + (volatilityScore * 0.3) + (roiScore * 0.3));

    // Determine risk level
    let riskLevel = 'High Risk';
    let riskColor = 'var(--danger)';
    if (riskScore >= 70) {
        riskLevel = 'Low Risk';
        riskColor = 'var(--success)';
    } else if (riskScore >= 40) {
        riskLevel = 'Medium Risk';
        riskColor = 'var(--warning)';
    }

    // Generate category breakdown
    let categoryHTML = '';
    Object.keys(categoryCounts).forEach(cat => {
        const count = categoryCounts[cat];
        const percentage = ((count / assets.length) * 100).toFixed(1);
        categoryHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border);">
                <span style="color: var(--text-secondary);">${cat}</span>
                <span style="font-weight: 600; color: var(--text-primary);">${count} (${percentage}%)</span>
            </div>
        `;
    });

    riskBox.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <!-- Risk Score Card -->
            <div style="padding: 24px; background: linear-gradient(135deg, ${riskColor}15 0%, ${riskColor}05 100%); border: 2px solid ${riskColor}; border-radius: 12px; text-align: center;">
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">Overall Risk Score</div>
                <div style="font-size: 3rem; font-weight: 700; color: ${riskColor}; margin-bottom: 8px;">${riskScore}</div>
                <div style="font-size: 1.1rem; font-weight: 600; color: ${riskColor};">${riskLevel}</div>
            </div>
            
            <!-- Diversification Card -->
            <div style="padding: 24px; background: var(--bg-dark); border-radius: 12px;">
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Portfolio Diversification</div>
                <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size: 2.5rem; font-weight: 700; color: var(--primary);">${diversificationScore.toFixed(0)}%</span>
                    <span style="color: var(--text-secondary);">across ${numCategories} categories</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                    ${diversificationScore >= 80 ? '✓ Well diversified' : diversificationScore >= 50 ? '⚠ Moderately diversified' : '⚠ Consider diversifying'}
                </div>
            </div>
            
            <!-- Volatility Card -->
            <div style="padding: 24px; background: var(--bg-dark); border-radius: 12px;">
                <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Portfolio Volatility</div>
                <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">${volatility.toFixed(1)}%</span>
                    <span style="color: var(--text-secondary);">variance</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                    ${volatility < 10 ? '✓ Low volatility' : volatility < 20 ? '⚠ Moderate volatility' : '⚠ High volatility'}
                </div>
            </div>
        </div>
        
        <!-- Asset Allocation Breakdown -->
        <div style="padding: 20px; background: var(--bg-dark); border-radius: 12px;">
            <h4 style="margin: 0 0 16px 0; color: var(--text-primary);">Asset Allocation by Category</h4>
            ${categoryHTML}
        </div>
        
        <!-- Risk Insights -->
        <div style="margin-top: 20px; padding: 16px; background: var(--bg-dark); border-left: 4px solid var(--primary); border-radius: 8px;">
            <strong style="color: var(--primary);">💡 Insights:</strong>
            <ul style="margin: 12px 0 0 0; padding-left: 20px; color: var(--text-secondary); line-height: 1.8;">
                ${roi > 10 ? '<li>Your portfolio is performing well with strong returns.</li>' : ''}
                ${diversificationScore < 60 ? '<li>Consider adding assets from different categories to improve diversification.</li>' : ''}
                ${volatility > 20 ? '<li>High volatility detected. Review your asset allocation to reduce risk.</li>' : ''}
                ${riskScore >= 70 ? '<li>Your portfolio shows healthy risk-return characteristics.</li>' : ''}
                ${numCategories < 3 ? '<li>Expanding into more asset categories could reduce concentration risk.</li>' : ''}
            </ul>
        </div>
    `;
}
