// Generate and print transaction receipt
function printTransactionReceipt(transaction) {
    // Create receipt HTML
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Transaction Receipt - ${transaction.referenceNo}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }
        .receipt {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 2px solid #1e3a8a;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e3a8a;
            font-size: 2rem;
            margin-bottom: 8px;
        }
        .header p {
            color: #475569;
            font-size: 0.9rem;
        }
        .receipt-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
        }
        .info-item {
            margin-bottom: 12px;
        }
        .info-label {
            font-size: 0.85rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 1.1rem;
            color: #0f172a;
            font-weight: 600;
        }
        .transaction-details {
            margin-bottom: 30px;
        }
        .transaction-details h2 {
            color: #1e3a8a;
            font-size: 1.25rem;
            margin-bottom: 16px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #475569;
            font-weight: 500;
        }
        .detail-value {
            color: #0f172a;
            font-weight: 600;
        }
        .amount-section {
            background: #1e3a8a;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .amount-section .label {
            font-size: 0.9rem;
            opacity: 0.9;
            margin-bottom: 8px;
        }
        .amount-section .amount {
            font-size: 2.5rem;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 0.85rem;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .badge-success { background: #d1fae5; color: #059669; }
        .badge-warning { background: #fed7aa; color: #d97706; }
        .badge-danger { background: #fee2e2; color: #dc2626; }
        @media print {
            body { padding: 0; background: white; }
            .receipt { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>🏦 FAMS</h1>
            <p>Finance Asset Management System</p>
            <p style="margin-top: 8px; font-size: 1.1rem; font-weight: 600;">TRANSACTION RECEIPT</p>
        </div>

        <div class="receipt-info">
            <div>
                <div class="info-item">
                    <div class="info-label">Receipt No.</div>
                    <div class="info-value">${transaction.referenceNo || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Transaction ID</div>
                    <div class="info-value">#${transaction.id || 'N/A'}</div>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value">${transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Time</div>
                    <div class="info-value">${transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleTimeString() : new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        </div>

        <div class="transaction-details">
            <h2>Transaction Details</h2>
            <div class="detail-row">
                <span class="detail-label">Transaction Type</span>
                <span class="detail-value">
                    <span class="badge ${getBadgeClass(transaction.type)}">${transaction.type || 'N/A'}</span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Asset ID</span>
                <span class="detail-value">#${transaction.assetId || transaction.asset?.id || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Asset Name</span>
                <span class="detail-value">${transaction.asset?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">${transaction.quantity || 1}</span>
            </div>
            ${transaction.fromUserId ? `<div class="detail-row">
                <span class="detail-label">From User ID</span>
                <span class="detail-value">#${transaction.fromUserId}</span>
            </div>` : ''}
            ${transaction.toUserId ? `<div class="detail-row">
                <span class="detail-label">To User ID</span>
                <span class="detail-value">#${transaction.toUserId}</span>
            </div>` : ''}
            ${transaction.notes ? `<div class="detail-row">
                <span class="detail-label">Notes</span>
                <span class="detail-value">${transaction.notes}</span>
            </div>` : ''}
        </div>

        <div class="amount-section">
            <div class="label">Total Amount</div>
            <div class="amount">₹${(transaction.amount || 0).toLocaleString('en-IN')}</div>
        </div>

        <div class="footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p style="margin-top: 8px;">Generated on ${new Date().toLocaleString()}</p>
            <p style="margin-top: 16px; font-weight: 600;">Thank you for using FAMS!</p>
        </div>
    </div>

    <script>
    </body>
</html>
    `;

    // Generate PDF using html2pdf
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library missing');
        if (typeof showToast !== 'undefined') showToast('PDF library not loaded', 'error');
        return;
    }

    const container = document.createElement('div');
    container.innerHTML = receiptHTML;

    let filename = `Receipt_${transaction.referenceNo || 'Transaction'}.pdf`;

    const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
    };

    if (typeof showToast !== 'undefined') showToast('Generating Receipt PDF...', 'info');
    html2pdf().set(opt).from(container).save().then(() => {
        if (typeof showToast !== 'undefined') showToast('Receipt downloaded successfully!', 'success');
    }).catch(err => {
        console.error('PDF Generation Error:', err);
        if (typeof showToast !== 'undefined') showToast('Failed to generate Receipt PDF', 'error');
    });
}

// Helper function for badge class
function getBadgeClass(type) {
    const classes = {
        'BUY': 'badge-success',
        'SELL': 'badge-warning',
        'TRANSFER': 'badge-success',
        'WITHDRAWAL': 'badge-danger'
    };
    return classes[type] || 'badge-success';
}
