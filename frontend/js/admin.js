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

        table.innerHTML = "<thead><tr><th>ID</th><th>Ref</th><th>Type</th><th>Asset</th><th>Amount</th><th>Date</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!txs || txs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-text">No transactions found</div></td></tr>';
            return;
        }

        txs.forEach(t => {
            const row = document.createElement("tr");
            const date = t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : 'N/A';
            row.innerHTML = `<td>${t.id || 'N/A'}</td><td>${t.referenceNo || 'N/A'}</td><td>${t.type || 'N/A'}</td><td>${t.asset?.id || 'N/A'}</td><td>₹${(t.amount || 0).toLocaleString()}</td><td>${date}</td>`;
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
    const config = {
        "asset-utilization": { path: "/reports/asset-utilization/pdf", filename: "asset-utilization.pdf" },
        "profit-loss": { path: "/reports/profit-loss/pdf", filename: "profit-loss.pdf" },
        "balance-sheet": { path: "/reports/balance-sheet/pdf", filename: "balance-sheet.pdf" }
    }[reportKey];

    if (!config) return;

    try {
        showLoading();
        await apiDownload(config.path, config.filename);
        showToast('Report downloaded successfully', 'success');
    } catch (err) {
        console.error("Failed to download report:", err);
        const box = document.getElementById("reportBox");
        if (box) box.textContent = "PDF download failed. Make sure you are logged in and have REPORT permission.";
    } finally {
        hideLoading();
    }
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
