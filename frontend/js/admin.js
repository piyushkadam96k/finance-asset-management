async function loadCategories() {
    try {
        const categories = await apiRequest("/categories");
        const select = document.getElementById("assetCategory");
        if (!select) return;

        select.innerHTML = '<option value="">Select Category</option>';

        if (!categories || categories.length === 0) {
            select.innerHTML += '<option disabled>No categories available</option>';
            return;
        }

        categories.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

async function loadAssets() {
    const table = document.getElementById("assetTable");
    if (!table) return;

    try {
        showLoading();
        const assets = await apiRequest("/assets");

        table.innerHTML = "<thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Category</th><th>Value</th><th>Actions</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!assets || assets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">No assets found</div><div class="empty-state-subtext">Create your first asset using the form above</div></td></tr>';
            return;
        }

        assets.forEach(a => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${a.id || 'N/A'}</td>
                <td>${a.assetCode || 'N/A'}</td>
                <td>${a.name || 'N/A'}</td>
                <td>${a.category?.name || 'N/A'}</td>
                <td>₹${(a.currentValue || 0).toLocaleString()}</td>
                <td>
                    <button type="button" onclick="editAsset(${a.id})" style="width: auto; padding: 6px 12px; margin: 0 4px; background: var(--accent);">✏️ Edit</button>
                    <button type="button" onclick="deleteAsset(${a.id}, '${a.name}')" style="width: auto; padding: 6px 12px; margin: 0 4px; background: var(--danger);">🗑️ Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load assets:", err);
        table.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-text">Failed to load assets</div><div class="empty-state-subtext">Please try refreshing the page</div></td></tr>';
    } finally {
        hideLoading();
    }
}

async function loadUsers() {
    const table = document.getElementById("userTable");
    if (!table) return;

    try {
        showLoading();
        const users = await apiRequest("/users");

        table.innerHTML = "<thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Roles</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">No users found</div></td></tr>';
            return;
        }

        users.forEach(u => {
            const row = document.createElement("tr");
            const roles = (u.roles || []).map(r => r.name || r).join(", ");
            row.innerHTML = `<td>${u.id || 'N/A'}</td><td>${u.fullName || 'N/A'}</td><td>${u.email || 'N/A'}</td><td>${roles || 'N/A'}</td>`;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load users:", err);
        table.innerHTML = "<tr><td colspan='4' class='empty-state'><div class='empty-state-text'>Not allowed to view users</div><div class='empty-state-subtext'>(Admin/Manager only)</div></td></tr>";
    } finally {
        hideLoading();
    }
}

async function loadTransactions() {
    const table = document.getElementById("txTable");
    if (!table) return;

    try {
        showLoading();
        const txs = await apiRequest("/transactions");

        table.innerHTML = "<thead><tr><th>ID</th><th>Ref</th><th>Type</th><th>Asset</th><th>Amount</th><th>Date</th><th>Actions</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!txs || txs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-text">No transactions found</div></td></tr>';
            return;
        }

        txs.forEach(t => {
            const row = document.createElement("tr");
            const date = t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : 'N/A';
            row.innerHTML = `
                <td>${t.id || 'N/A'}</td>
                <td>${t.referenceNo || 'N/A'}</td>
                <td>${t.type || 'N/A'}</td>
                <td>${t.asset?.id || 'N/A'}</td>
                <td>₹${(t.amount || 0).toLocaleString()}</td>
                <td>${date}</td>
                <td>
                    <button type="button" onclick="editTransaction(${t.id})" style="width: auto; padding: 6px 12px; margin: 0 4px; background: var(--accent);">✏️ Edit</button>
                    <!-- Deletion not fully spec'd in requirements but UI can support it if needed later -->
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load transactions:", err);
        table.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-text">Failed to load transactions</div></td></tr>';
    } finally {
        hideLoading();
    }
}

async function loadReports() {
    const box = document.getElementById("reportBox");
    if (!box) return;

    try {
        showLoading();
        const assetUtil = await apiRequest("/reports/asset-utilization");
        const profitLoss = await apiRequest("/reports/profit-loss");
        const balance = await apiRequest("/reports/balance-sheet");
        box.textContent = JSON.stringify({ assetUtil, profitLoss, balance }, null, 2);
        showToast('Reports loaded successfully', 'success');
    } catch (err) {
        console.error("Failed to load reports:", err);
        box.textContent = "Not allowed to view reports (REPORT permission required).";
    } finally {
        hideLoading();
    }
}

async function downloadReportPdf(reportKey) {
    try {
        showLoading();
        let reportHTML = '';

        if (reportKey === 'profit-loss') {
            const data = await apiRequest("/reports/profit-loss");
            reportHTML = generateProfitLossHTML(data);
        } else if (reportKey === 'asset-utilization') {
            const data = await apiRequest("/reports/asset-utilization");
            reportHTML = generateAssetUtilizationHTML(data);
        } else if (reportKey === 'balance-sheet') {
            const data = await apiRequest("/reports/balance-sheet");
            reportHTML = generateBalanceSheetHTML(data);
        } else {
            showToast('Unknown report type', 'error');
            return;
        }

        // Generate PDF using html2pdf
        const container = document.createElement('div');
        container.innerHTML = reportHTML;

        let filename = `${reportKey}_report_${new Date().toISOString().split('T')[0]}.pdf`;

        const opt = {
            margin: 0.5,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
        };

        showToast('Generating PDF, please wait...', 'info');
        html2pdf().set(opt).from(container).save().then(() => {
            showToast('PDF downloaded successfully!', 'success');
        }).catch(err => {
            console.error('PDF Generation Error:', err);
            showToast('Failed to generate PDF', 'error');
        });
    } catch (err) {
        console.error("Failed to generate report:", err);
        showToast('Failed to generate report PDF', 'error');
    } finally {
        hideLoading();
    }
}

function getReportCSS() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; padding: 40px; background: #f5f5f5; color: #0f172a; }
        .report { max-width: 800px; margin: 0 auto; background: white; padding: 48px; border: 2px solid #1e3a8a; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 24px; margin-bottom: 32px; }
        .header h1 { color: #1e3a8a; font-size: 1.8rem; margin-bottom: 4px; }
        .header h2 { color: #475569; font-size: 1.2rem; font-weight: 400; margin-bottom: 8px; }
        .header .date { color: #64748b; font-size: 0.9rem; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .summary-card { padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center; }
        .summary-card .label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .summary-card .value { font-size: 1.5rem; font-weight: 700; }
        .profit { color: #059669; }
        .loss { color: #dc2626; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th { background: #1e3a8a; color: white; padding: 12px 16px; text-align: left; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
        tr:nth-child(even) { background: #f8fafc; }
        .section-title { font-size: 1.2rem; color: #1e3a8a; margin: 32px 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 0.85rem; }
        .text-right { text-align: right; }
        @media print {
            body { padding: 0; background: white; }
            .report { box-shadow: none; border: none; padding: 20px; }
            .no-print { display: none; }
        }
    `;
}

function generateProfitLossHTML(data) {
    const totalProfit = data.totalProfit || 0;
    const totalLoss = data.totalLoss || 0;
    const net = data.netProfitLoss || 0;
    const breakdown = data.breakdown || [];

    let rowsHTML = '';
    breakdown.forEach((item, i) => {
        const pl = item.profit || 0;
        const pct = item.percentageChange || '0';
        const plClass = pl >= 0 ? 'profit' : 'loss';
        const plSign = pl >= 0 ? '+' : '';
        rowsHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.assetName || 'N/A'}</td>
                <td class="text-right ${plClass}">${plSign}₹${pl.toLocaleString('en-IN')}</td>
                <td class="text-right ${plClass}">${plSign}${pct}%</td>
            </tr>
        `;
    });

    return `<!DOCTYPE html><html><head>
        <title>Profit & Loss Report - FAMS</title>
        <style>${getReportCSS()}</style>
    </head><body>
        <div class="report">
            <div class="header">
                <h1>🏦 FAMS</h1>
                <h2>Profit & Loss Report</h2>
                <div class="date">Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div class="summary-grid">
                <div class="summary-card">
                    <div class="label">Total Profit</div>
                    <div class="value profit">₹${totalProfit.toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Total Loss</div>
                    <div class="value loss">₹${totalLoss.toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Net P&L</div>
                    <div class="value ${net >= 0 ? 'profit' : 'loss'}">${net >= 0 ? '+' : ''}₹${net.toLocaleString('en-IN')}</div>
                </div>
            </div>

            <h3 class="section-title">Asset-wise Breakdown</h3>
            <table>
                <thead>
                    <tr><th>#</th><th>Asset Name</th><th class="text-right">Profit / Loss</th><th class="text-right">Change %</th></tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>

            <div class="footer">
                <p>This is a computer-generated report.</p>
                <p style="margin-top: 8px;">Finance Asset Management System (FAMS) — ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body></html>`;
}

function generateAssetUtilizationHTML(data) {
    const items = data.data || [];
    let rowsHTML = '';
    items.forEach((item, i) => {
        rowsHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.name || 'N/A'}</td>
                <td>${item.category || 'N/A'}</td>
                <td class="text-right">${item.utilization || 'N/A'}</td>
                <td>${item.status || 'N/A'}</td>
            </tr>
        `;
    });

    return `<!DOCTYPE html><html><head>
        <title>Asset Utilization Report - FAMS</title>
        <style>${getReportCSS()}</style>
    </head><body>
        <div class="report">
            <div class="header">
                <h1>🏦 FAMS</h1>
                <h2>Asset Utilization Report</h2>
                <div class="date">Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div class="summary-grid">
                <div class="summary-card">
                    <div class="label">Total Assets</div>
                    <div class="value">${items.length}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Active Assets</div>
                    <div class="value profit">${items.filter(i => i.status === 'ACTIVE').length}</div>
                </div>
            </div>

            <h3 class="section-title">Asset Details</h3>
            <table>
                <thead>
                    <tr><th>#</th><th>Asset Name</th><th>Category</th><th class="text-right">Utilization</th><th>Status</th></tr>
                </thead>
                <tbody>${rowsHTML}</tbody>
            </table>

            <div class="footer">
                <p>This is a computer-generated report.</p>
                <p style="margin-top: 8px;">Finance Asset Management System (FAMS) — ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body></html>`;
}

function generateBalanceSheetHTML(data) {
    return `<!DOCTYPE html><html><head>
        <title>Balance Sheet - FAMS</title>
        <style>${getReportCSS()}</style>
    </head><body>
        <div class="report">
            <div class="header">
                <h1>🏦 FAMS</h1>
                <h2>Balance Sheet</h2>
                <div class="date">As of ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>

            <div class="summary-grid">
                <div class="summary-card">
                    <div class="label">Total Assets</div>
                    <div class="value profit">₹${(data.totalAssets || 0).toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Total Liabilities</div>
                    <div class="value loss">₹${(data.totalLiabilities || 0).toLocaleString('en-IN')}</div>
                </div>
                <div class="summary-card">
                    <div class="label">Net Worth</div>
                    <div class="value" style="color: #1e3a8a;">₹${(data.netWorth || 0).toLocaleString('en-IN')}</div>
                </div>
            </div>

            <h3 class="section-title">Summary</h3>
            <table>
                <thead><tr><th>Item</th><th class="text-right">Amount (₹)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Assets</strong></td><td class="text-right profit">₹${(data.totalAssets || 0).toLocaleString('en-IN')}</td></tr>
                    <tr><td><strong>Liabilities</strong></td><td class="text-right loss">₹${(data.totalLiabilities || 0).toLocaleString('en-IN')}</td></tr>
                    <tr style="background: #f1f5f9;"><td><strong>Net Worth (Assets - Liabilities)</strong></td><td class="text-right" style="font-size: 1.1rem; font-weight: 700; color: #1e3a8a;">₹${(data.netWorth || 0).toLocaleString('en-IN')}</td></tr>
                </tbody>
            </table>

            <div class="footer">
                <p>This is a computer-generated report.</p>
                <p style="margin-top: 8px;">Finance Asset Management System (FAMS) — ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body></html>`;
}

const assetForm = document.getElementById("assetForm");
if (assetForm) {
    let isSubmitting = false;

    assetForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const submitBtn = assetForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const payload = {
            assetCode: document.getElementById("assetCode")?.value,
            name: document.getElementById("assetName")?.value,
            categoryId: Number(document.getElementById("assetCategory")?.value),
            purchaseDate: document.getElementById("purchaseDate")?.value,
            purchaseValue: Number(document.getElementById("purchaseValue")?.value),
            currentValue: Number(document.getElementById("currentValue")?.value),
            ownerId: Number(document.getElementById("ownerId")?.value)
        };

        const msg = document.getElementById("assetMsg");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            showLoading();

            await apiRequest("/assets", "POST", payload);

            if (msg) msg.textContent = "Asset created successfully!";
            showToast('Asset created successfully!', 'success');

            // Reset form
            assetForm.reset();

            // Reload assets
            await loadAssets();
        } catch (err) {
            console.error("Failed to create asset:", err);
            if (msg) msg.textContent = err.message || "Failed to create asset";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isSubmitting = false;
            hideLoading();
        }
    });
}

const txForm = document.getElementById("txForm");
if (txForm) {
    let isSubmitting = false;

    txForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const submitBtn = txForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const payload = {
            assetId: Number(document.getElementById("txAssetId")?.value),
            type: document.getElementById("txType")?.value,
            quantity: Number(document.getElementById("txQty")?.value || 1),
            price: document.getElementById("txPrice")?.value ? Number(document.getElementById("txPrice").value) : null,
            fromUserId: Number(document.getElementById("txFrom")?.value || 0) || null,
            toUserId: Number(document.getElementById("txTo")?.value || 0) || null,
            notes: document.getElementById("txNotes")?.value
        };

        const msg = document.getElementById("txMsg");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            showLoading();

            await apiRequest("/transactions", "POST", payload);

            if (msg) msg.textContent = "Transaction created successfully!";
            showToast('Transaction created successfully!', 'success');

            // Reset form
            txForm.reset();

            // Reload data
            await Promise.all([loadTransactions(), loadAssets()]);
        } catch (err) {
            console.error("Failed to create transaction:", err);
            if (msg) msg.textContent = err.message || "Failed to create transaction";
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isSubmitting = false;
            hideLoading();
        }
    });
}

// Edit Asset Function
async function editAsset(assetId) {
    try {
        showLoading();
        const asset = await apiRequest(`/assets/${assetId}`);
        hideLoading();

        // Create modal HTML
        const modalHTML = `
            <div id="editAssetModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease;">
                <div class="card" style="max-width: 500px; width: 90%; margin: 20px; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin-bottom: 20px;">✏️ Edit Asset</h3>
                    <form id="editAssetForm">
                        <input type="hidden" id="editAssetId" value="${asset.id}" />
                        <label>Asset Code</label>
                        <input id="editAssetCode" value="${asset.assetCode || ''}" required />
                        <label>Asset Name</label>
                        <input id="editAssetName" value="${asset.name || ''}" required />
                        <label>Category</label>
                        <select id="editAssetCategory" required>
                            <option value="">Loading...</option>
                        </select>
                        <label>Purchase Date</label>
                        <input type="date" id="editPurchaseDate" value="${asset.purchaseDate || ''}" required />
                        <label>Purchase Value (₹)</label>
                        <input type="number" id="editPurchaseValue" value="${asset.purchaseValue || 0}" min="0" step="0.01" required />
                        <label>Current Value (₹)</label>
                        <input type="number" id="editCurrentValue" value="${asset.currentValue || 0}" min="0" step="0.01" required />
                        <label>Owner User ID</label>
                        <input type="number" id="editOwnerId" value="${asset.ownerId || 1}" min="1" required />
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" style="flex: 1;">💾 Update Asset</button>
                            <button type="button" onclick="closeEditModal()" style="flex: 1; background: var(--secondary);">❌ Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Load categories for dropdown
        const categories = await apiRequest("/categories");
        const catSelect = document.getElementById("editAssetCategory");
        catSelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            if (asset.categoryId === c.id) opt.selected = true;
            catSelect.appendChild(opt);
        });

        // Handle form submission
        document.getElementById("editAssetForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const updateData = {
                assetCode: document.getElementById("editAssetCode").value,
                name: document.getElementById("editAssetName").value,
                categoryId: Number(document.getElementById("editAssetCategory").value),
                purchaseDate: document.getElementById("editPurchaseDate").value,
                purchaseValue: Number(document.getElementById("editPurchaseValue").value),
                currentValue: Number(document.getElementById("editCurrentValue").value),
                ownerId: Number(document.getElementById("editOwnerId").value)
            };

            try {
                showLoading();
                await apiRequest(`/assets/${assetId}`, "PUT", updateData);
                showToast('Asset updated successfully!', 'success');
                closeEditModal();
                await loadAssets();
            } catch (err) {
                console.error("Failed to update asset:", err);
                showToast(err.message || 'Failed to update asset', 'error');
            } finally {
                hideLoading();
            }
        });
    } catch (err) {
        console.error("Failed to load asset for editing:", err);
        showToast('Failed to load asset details', 'error');
        hideLoading();
    }
}

function closeEditModal() {
    const modal = document.getElementById("editAssetModal");
    if (modal) modal.remove();
}

// Delete Asset Function
async function deleteAsset(assetId, assetName) {
    if (!confirm(`⚠️ Are you sure you want to delete asset "${assetName}"?\n\nThis action cannot be undone!`)) {
        return;
    }

    try {
        showLoading();
        await apiRequest(`/assets/${assetId}`, "DELETE");
        showToast('Asset deleted successfully!', 'success');
        await loadAssets();
    } catch (err) {
        console.error("Failed to delete asset:", err);
        showToast(err.message || 'Failed to delete asset', 'error');
    } finally {
        hideLoading();
    }
}

// Edit Transaction Function
async function editTransaction(txId) {
    try {
        showLoading();
        // We'll fetch from the transactions list initially since there's no single GET /api/transactions/:id documented
        const allTxs = await apiRequest("/transactions");
        const tx = allTxs.find(t => t.id === txId);
        hideLoading();

        if (!tx) {
            showToast('Transaction not found', 'error');
            return;
        }

        // Create modal HTML
        const modalHTML = `
            <div id="editTxModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease;">
                <div class="card" style="max-width: 500px; width: 90%; margin: 20px; max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin-bottom: 20px;">✏️ Edit Transaction</h3>
                    <form id="editTxForm">
                        <input type="hidden" id="editTxId" value="${tx.id}" />
                        
                        <label>Quantity</label>
                        <input type="number" id="editTxQty" value="${tx.quantity || 1}" min="1" required />
                        
                        <label>Price Per Unit (₹)</label>
                        <input type="number" id="editTxPrice" value="${tx.price || 0}" min="0" step="0.01" required />
                        
                        <label>Notes</label>
                        <input type="text" id="editTxNotes" value="${tx.notes || ''}" />
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button type="submit" style="flex: 1;">💾 Update Transaction</button>
                            <button type="button" onclick="closeTxEditModal()" style="flex: 1; background: var(--secondary);">❌ Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Handle form submission
        document.getElementById("editTxForm").addEventListener("submit", async (e) => {
            e.preventDefault();

            const updateData = {
                quantity: Number(document.getElementById("editTxQty").value),
                price: Number(document.getElementById("editTxPrice").value),
                notes: document.getElementById("editTxNotes").value
            };

            try {
                showLoading();
                await apiRequest(`/transactions/${txId}`, "PUT", updateData);
                showToast('Transaction updated successfully!', 'success');
                closeTxEditModal();
                await loadTransactions();
            } catch (err) {
                console.error("Failed to update transaction:", err);
                showToast(err.message || 'Failed to update transaction', 'error');
            } finally {
                hideLoading();
            }
        });
    } catch (err) {
        console.error("Failed to load transaction for editing:", err);
        showToast('Failed to load transaction details', 'error');
        hideLoading();
    }
}

function closeTxEditModal() {
    const modal = document.getElementById("editTxModal");
    if (modal) modal.remove();
}

// Initialize on page load
if (document.getElementById("assetTable")) {
    // Delay to ensure DOM is ready
    setTimeout(() => {
        Promise.all([
            loadCategories(),
            loadUsers(),
            loadAssets(),
            loadTransactions()
        ]).catch(err => {
            console.error("Failed to initialize admin dashboard:", err);
            showToast('Failed to load some data. Please refresh the page.', 'error');
        });
    }, 100);
}
