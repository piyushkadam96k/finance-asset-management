async function loadAssets() {
    const table = document.getElementById("assetTable");
    if (!table) return;

    try {
        const assets = await apiRequest("/assets");

        table.innerHTML = "<thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Category</th><th>Value</th></tr></thead><tbody></tbody>";
        const tbody = table.querySelector('tbody');

        if (!assets || assets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-icon">📦</div><div class="empty-state-text">No assigned assets</div></td></tr>';
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
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load assets:", err);
        table.innerHTML = '<tr><td colspan="5" class="empty-state"><div class="empty-state-text">Failed to load assets</div></td></tr>';
    }
}

async function loadTransactions() {
    const table = document.getElementById("txTable");
    if (!table) return;

    try {
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
    }
}

// Initialize on page load
if (document.getElementById("assetTable") || document.getElementById("txTable")) {
    // Delay to ensure DOM is ready
    setTimeout(() => {
        Promise.all([
            loadAssets(),
            loadTransactions()
        ]).catch(err => {
            console.error("Failed to initialize employee dashboard:", err);
            showToast('Failed to load data. Please refresh the page.', 'error');
        });
    }, 100);
}
