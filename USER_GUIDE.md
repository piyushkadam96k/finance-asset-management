# 📖 Finance Asset Management System - Complete User Guide

**A comprehensive guide to using all features of the FAMS application**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Asset Management](#asset-management)
5. [Transaction Management](#transaction-management)
6. [Depreciation Module](#depreciation-module)
7. [Portfolio Analytics](#portfolio-analytics)
8. [Reports & PDF Export](#reports--pdf-export)
9. [Profile Management](#profile-management)
10. [Common Workflows](#common-workflows)
11. [Tips & Best Practices](#tips--best-practices)

---

## Getting Started

### What is FAMS?

The Finance Asset Management System (FAMS) is a web-based application that helps organizations manage their financial assets, track transactions, calculate depreciation, and analyze portfolio performance.

### Who Uses FAMS?

The system supports **4 different user roles:**

1. **Admin** - Full system access, manages everything
2. **Manager** - Manages assets and transactions for their team
3. **Employee** - Similar to Admin access
4. **Investor** - Views portfolio and analyzes investments

### First Time Setup

1. Make sure both servers are running:
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:5500`

2. Open your browser and go to:
   ```
   http://localhost:5500/index.html
   ```

3. You'll see the login page - choose your role!

---

## Login & Authentication

### How to Login

1. **Open the application** → `http://localhost:5500/index.html`

2. **Enter credentials:**
   - Email: Use one of the test accounts
   - Password: `password` (for all accounts)

3. **Click "Sign In"**

4. **You're redirected** to your role-specific dashboard

### Available Accounts

| Role | Email | Dashboard |
|------|-------|-----------|
| Admin | admin@trikut.com | Admin Dashboard |
| Manager | manager@trikut.com | Manager Dashboard |
| Employee | employee@trikut.com | Admin Dashboard |
| Investor | investor@trikut.com | Investor Dashboard |

### Security Features

- **JWT Tokens:** Secure authentication using JSON Web Tokens
- **Role-Based Access:** Different permissions for different roles
- **Auto Logout:** Session expires after period of inactivity
- **Password Protection:** All accounts password protected

### How to Logout

Click the **"Logout"** button in the top-right corner of any dashboard.

---

## Dashboard Overview

### Admin Dashboard

**Purpose:** Complete system management and oversight

**Sections:**

1. **Quick Stats** (Top cards)
   - Total Assets count
   - Total Value of all assets
   - Total Transactions recorded

2. **Create Asset** (Left panel)
   - Form to add new assets
   - Includes depreciation settings

3. **Record Transaction** (Right panel)
   - Record BUY, SELL, TRANSFER, WITHDRAWAL

4. **Assets Table** (Middle section)
   - View all assets
   - Edit button (✏️) for each asset
   - Delete button (🗑️) for each asset

5. **Transactions Table** (Lower section)
   - All transaction history
   - Filter by type

6. **Users Table**
   - All system users
   - View user details and roles

7. **Reports Section** (Bottom)
   - Generate 3 types of reports
   - Download as PDF

### Manager Dashboard

**Purpose:** Team asset and transaction management

**Similar to Admin but includes:**
- Team member view
- Same asset management capabilities
- Same transaction recording
- Same reporting features

### Investor Dashboard

**Purpose:** Portfolio monitoring and performance tracking

**Sections:**

1. **Portfolio Summary** (Top)
   - Total Assets you own
   - Total Portfolio Value
   - Total Investment
   - ROI percentage

2. **Advanced Portfolio Analytics** (Middle)
   - Risk Score (0-100)
   - Diversification percentage
   - Volatility metrics
   - Asset allocation breakdown
   - AI-powered insights

3. **Your Assets** (Bottom)
   - All assets you own
   - Current values
   - Profit/Loss per asset

---

## Asset Management

### Understanding Assets

**What is an Asset?**
An asset is anything of value that the organization owns:
- Properties (buildings, land)
- Vehicles (cars, trucks)
- Equipment (computers, machinery)
- Investments (stocks, bonds)

### Creating a New Asset

**Step-by-Step:**

1. **Login as Admin or Manager**

2. **Go to "Create Asset" form**

3. **Fill in required fields:**

   - **Asset Code:** Unique identifier (e.g., `PROP-001`, `VEH-001`)
   - **Name:** Descriptive name (e.g., `Office Building`, `Delivery Truck`)
   - **Category:** Select from dropdown
     - Real Estate
     - Vehicles
     - Technology
     - Stocks
     - etc.
   - **Purchase Date:** When asset was acquired
   - **Purchase Value:** Original cost (₹)
   - **Current Value:** Current market value (₹)
   - **Owner User ID:** Who owns it (enter user ID number)

4. **(Optional) Add Depreciation Settings:**

   - **Depreciation Method:** Choose one
     - `No Depreciation` - Asset doesn't lose value
     - `Straight Line Method` - Equal depreciation each year
     - `Reducing Balance Method` - Higher depreciation early on
   
   - **Useful Life:** Expected lifespan (in years)
   - **Salvage Value:** Expected value at end of life (₹)

5. **Click "💾 Create Asset"**

6. **Success!** Asset appears in the table below

### Editing an Existing Asset

**Step-by-Step:**

1. **Find the asset** in the Assets Table

2. **Click the "✏️ Edit" button** on that asset's row

3. **Modal window opens** with all asset details pre-filled

4. **Modify any fields** you want to change:
   - Update current value
   - Change category
   - Update depreciation settings
   - etc.

5. **Click "Update Asset"**

6. **Success!** Table refreshes with updated values

**What You Can Edit:**
- Asset Code
- Asset Name
- Category
- Purchase Date
- Purchase Value
- Current Value
- Owner ID
- Depreciation settings

**What Happens:**
- Table updates immediately
- Success notification appears
- Changes saved to backend

### Deleting an Asset

**Step-by-Step:**

1. **Find the asset** in the Assets Table

2. **Click the "🗑️ Delete" button**

3. **Confirmation dialog appears:**
   ```
   Are you sure you want to delete this asset?
   This action cannot be undone.
   ```

4. **Click "OK" to confirm** or "Cancel" to abort

5. **Success!** Asset removed from table

**Important Notes:**
- ⚠️ **Deletion is permanent** - cannot be undone
- All associated transactions remain in history
- Other users lose access to this asset

### Viewing Asset Details

**In the Assets Table, you can see:**

- **ID:** Unique asset identifier
- **Code:** Your custom asset code
- **Name:** Asset name
- **Category:** Asset type
- **Value:** Current value in ₹
- **Purchase Value:** Original cost
- **Current Value:** Latest valuation
- **Actions:** Edit and Delete buttons

---

## Transaction Management

### Understanding Transactions

**What is a Transaction?**
A transaction is any financial activity involving an asset:
- Buying an asset
- Selling an asset
- Transferring to another user
- Withdrawing from the portfolio

### Transaction Types

#### 1. BUY Transaction
**When to use:** Acquiring a new asset

**Fields:**
- Asset ID
- Quantity
- Price (amount paid)
- Notes (optional)

**Example:**
```
Type: BUY
Asset ID: 5
Quantity: 1
Price: 5000000
Notes: Purchase of office building
```

#### 2. SELL Transaction
**When to use:** Selling an existing asset

**Fields:**
- Asset ID
- Quantity
- Price (sale amount)
- From User ID (seller)
- To User ID (buyer - optional)
- Notes

**Example:**
```
Type: SELL
Asset ID: 3
Quantity: 1
Price: 350000
From: User 2
Notes: Vehicle sold to external party
```

#### 3. TRANSFER Transaction
**When to use:** Moving asset between users

**Fields:**
- Asset ID
- Quantity
- From User ID (current owner)
- To User ID (new owner)
- Notes

**Example:**
```
Type: TRANSFER
Asset ID: 7
From User: 2
To User: 4
Notes: Transferred laptop to new employee
```

#### 4. WITHDRAWAL Transaction
**When to use:** Removing from active portfolio

**Fields:**
- Asset ID
- Quantity
- From User ID
- Notes

**Example:**
```
Type: WITHDRAWAL
Asset ID: 10
From User: 3
Quantity: 1
Notes: Asset retired from service
```

### Recording a Transaction

**Step-by-Step:**

1. **Login as Admin or Manager**

2. **Go to "Record Transaction" form**

3. **Fill in the fields:**

   - **Asset ID:** Enter the asset's ID number
   - **Transaction Type:** Select from dropdown (BUY/SELL/TRANSFER/WITHDRAWAL)
   - **Quantity:** Number of units (usually 1)
   - **Price:** Transaction amount (if applicable)
   - **From User ID:** Source user (for SELL/TRANSFER/WITHDRAWAL)
   - **To User ID:** Destination user (for TRANSFER)
   - **Notes:** Additional details (optional)

4. **Click "💳 Record Transaction"**

5. **Success!** Transaction saved and appears in history

### Viewing Transaction History

**In the Transactions Table:**

- **ID:** Transaction number
- **Asset:** Asset name/ID
- **Type:** Transaction type (badge colored)
  - BUY = Green
  - SELL = Blue
  - TRANSFER = Purple
  - WITHDRAWAL = Orange
- **Amount:** Transaction value
- **Date:** When it occurred
- **Details:** Additional info

### Printing Transaction Receipts

**Method 1: Using Console (for any transaction)**

1. **Open browser console** (Press F12)

2. **Paste this code:**
   ```javascript
   printTransactionReceipt({
     id: 1,
     referenceNo: "TX-20260207-001",
     type: "BUY",
     assetId: 5,
     asset: { name: "Office Building" },
     amount: 5000000,
     quantity: 1,
     transactionDate: new Date(),
     notes: "Sample transaction"
   })
   ```

3. **Press Enter**

4. **New window opens** with professional receipt

5. **Print or Save as PDF** using browser print function (Ctrl+P)

**Receipt Contains:**
- FAMS logo and branding
- Receipt number
- Transaction ID
- Date and time
- Transaction type
- Asset details
- Amount
- Notes
- Footer with disclaimer

**Method 2: Future Enhancement**
Print buttons can be added to each transaction row for one-click printing.

---

## Depreciation Module

### Understanding Depreciation

**What is Depreciation?**
Depreciation is the reduction in value of an asset over time due to:
- Wear and tear
- Age
- Obsolescence
- Market conditions

**Why Track It?**
- Accurate asset valuation
- Financial reporting
- Tax calculations
- Investment decisions

### Depreciation Methods

#### 1. Straight Line Method

**How it works:**
- Asset loses equal value each year
- Simplest calculation
- Most common for buildings, furniture

**Formula:**
```
Annual Depreciation = (Purchase Value - Salvage Value) / Useful Life
```

**Example:**
```
Laptop purchased for ₹100,000
Useful life: 5 years
Salvage value: ₹20,000

Annual Depreciation = (100,000 - 20,000) / 5 = ₹16,000/year

Year 1: ₹84,000 (100,000 - 16,000)
Year 2: ₹68,000 (84,000 - 16,000)
Year 3: ₹52,000 (68,000 - 16,000)
Year 4: ₹36,000 (52,000 - 16,000)
Year 5: ₹20,000 (36,000 - 16,000) → Salvage value reached
```

#### 2. Reducing Balance Method (20%)

**How it works:**
- Asset loses 20% of remaining value each year
- Higher depreciation in early years
- Common for vehicles, technology

**Formula:**
```
Annual Depreciation = Book Value × 20%
Book Value = Previous Year's Book Value - Annual Depreciation
```

**Example:**
```
Vehicle purchased for ₹500,000
Rate: 20% per year
Salvage value: ₹100,000

Year 1: 500,000 - (500,000 × 0.20) = ₹400,000
Year 2: 400,000 - (400,000 × 0.20) = ₹320,000
Year 3: 320,000 - (320,000 × 0.20) = ₹256,000
Year 4: 256,000 - (256,000 × 0.20) = ₹204,800
(Continues until salvage value reached)
```

#### 3. No Depreciation

**When to use:**
- Land (typically doesn't depreciate)
- Artwork
- Collectibles
- Assets that appreciate

### Adding Depreciation to Assets

**When Creating Asset:**

1. Fill basic asset details (as shown in Asset Management)

2. Scroll to **"📉 Depreciation Settings (Optional)"**

3. **Select Depreciation Method:**
   - No Depreciation
   - Straight Line Method
   - Reducing Balance Method (20%)

4. **Enter Useful Life:**
   - Number of years asset will be used
   - Example: 5 years for a laptop, 25 years for a building

5. **Enter Salvage Value:**
   - Expected value at end of useful life
   - Can be ₹0 if no residual value

6. **Create Asset**

**System Automatically Calculates:**
- Annual depreciation amount
- Accumulated depreciation (total so far)
- Current book value
- Years since purchase
- Depreciation rate (%)

**When Editing Asset:**

You can update depreciation settings at any time:
1. Click Edit (✏️)
2. Change depreciation method or values
3. Save
4. Depreciation recalculates automatically

### Viewing Depreciation Information

Depreciation details are shown:
- In asset details when viewing
- In financial reports
- In balance sheets
- When calculating current book value

---

## Portfolio Analytics

### Basic Portfolio Metrics

**Available to All Roles:**

1. **Total Assets:** Number of assets owned
2. **Total Value:** Combined current value of all assets
3. **Total Investment:** Total amount invested
4. **ROI (Return on Investment):** Percentage gain/loss

**ROI Calculation:**
```
ROI = ((Current Value - Investment) / Investment) × 100%

Example:
Investment: ₹10,00,000
Current Value: ₹12,50,000
ROI = ((12,50,000 - 10,00,000) / 10,00,000) × 100% = 25%
```

### Advanced Portfolio Analytics (Investor Dashboard)

**Feature Location:** Investor Dashboard → "📊 Advanced Portfolio Analytics"

#### 1. Overall Risk Score

**What it shows:** Risk level from 0-100
- **70-100 (Green):** Low Risk - Safe, well-balanced
- **40-69 (Yellow):** Medium Risk - Acceptable
- **0-39 (Red):** High Risk - Needs attention

**How it's calculated:**
```
Risk Score = (40% × Diversification) + (30% × Volatility) + (30% × ROI)
```

**What it means:**
- Higher score = Lower risk
- Considers multiple factors
- Holistic portfolio health measure

#### 2. Diversification Score

**What it shows:** How spread out your investments are

**Calculation:**
```
Diversification = (Number of Categories / 5) × 100%

Example:
Assets in 4 different categories → 80% diversified
Assets in 2 categories → 40% diversified
```

**Categories counted:**
- Real Estate
- Vehicles
- Technology
- Stocks
- Bonds
- Commodities
- etc.

**What it means:**
- ✅ **80-100%:** Well diversified
- ⚠️ **50-79%:** Moderately diversified
- ⚠️ **Below 50%:** Consider diversifying

**Why it matters:**
- Reduces concentration risk
- Protects against market sector downturns
- Balances portfolio

#### 3. Portfolio Volatility

**What it shows:** How much your asset values fluctuate

**Calculation:**
```
Based on variance of profit/loss across all assets
Lower volatility = More stable portfolio
```

**Interpretation:**
- ✅ **Below 10%:** Low volatility (stable)
- ⚠️ **10-20%:** Moderate volatility
- ⚠️ **Above 20%:** High volatility (risky)

**What it means:**
- High volatility = Unpredictable returns
- Low volatility = Steady performance

#### 4. Asset Allocation Breakdown

**What it shows:** Distribution of assets by category

**Example Display:**
```
Real Estate: 5 assets (40%)
Stocks: 4 assets (32%)
Bonds: 2 assets (16%)
Commodities: 1 asset (8%)
Technology: 1 asset (4%)
```

**How to use it:**
- Identify overconcentration
- Find categories to expand into
- Balance your portfolio

#### 5. AI-Powered Insights

**What it shows:** Smart recommendations based on your portfolio

**Example Insights:**
- ✅ "Your portfolio is performing well with strong returns."
- ⚠️ "Consider adding assets from different categories to improve diversification."
- ⚠️ "High volatility detected. Review your asset allocation to reduce risk."
- ✅ "Your portfolio shows healthy risk-return characteristics."
- ⚠️ "Expanding into more asset categories could reduce concentration risk."

**How insights work:**
- Analyzes your specific portfolio data
- Compares against best practices
- Provides actionable recommendations
- Updates in real-time

### How to Improve Your Portfolio

**Based on Analytics:**

1. **Low Diversification?**
   → Add assets from different categories

2. **High Risk Score?**
   → Review high-volatility assets
   → Consider more stable investments

3. **High Volatility?**
   → Balance with steady-value assets
   → Avoid over-concentration in volatile sectors

4. **Low ROI?**
   → Review underperforming assets
   → Consider selling losses
   → Reinvest in better opportunities

---

## Reports & PDF Export

### Available Reports

#### 1. Asset Utilization Report

**What it shows:**
- All assets owned
- Current values
- Utilization status
- Category breakdown

**How to generate:**
1. Go to Admin or Manager Dashboard
2. Scroll to "Financial Reports" section
3. Click "📈 Load Reports"
4. View "Asset Utilization Report"

**How to export PDF:**
- Click "📄 Asset Utilization PDF"
- PDF downloads automatically
- Contains all asset details

#### 2. Profit & Loss Statement

**What it shows:**
- Revenue from asset sales
- Costs of asset purchases
- Net profit/loss
- Period-to-date performance

**How to generate:**
1. Click "📈 Load Reports"
2. View "Profit & Loss Statement"

**How to export PDF:**
- Click "📄 Profit & Loss PDF"
- Professional formatted statement
- Ready for accounting use

#### 3. Balance Sheet

**What it shows:**
- Assets (what you own)
- Liabilities (what you owe)
- Equity (net worth)
- Financial position snapshot

**How to generate:**
1. Click "📈 Load Reports"
2. View "Balance Sheet"

**How to export PDF:**
- Click "📄 Balance Sheet PDF"
- Standard accounting format
- Suitable for external reporting

### Report Features

**All reports include:**
- Date generated
- Company branding
- Detailed breakdowns
- Subtotals and totals
- Professional formatting

**PDF Export Quality:**
- Print-ready
- High-quality formatting
- Searchable text
- Standard A4 size
- Professional appearance

---

## Profile Management

### Accessing Your Profile

**From Any Dashboard:**

1. **Look for "👤 Profile" button** in top-right corner

2. **Click the button**

3. **Profile page opens**

### Profile Page Sections

#### 1. Profile Information Card

**What you see:**
- Profile picture (initial letter)
- Full name
- Email address
- Role badges (Admin, Manager, etc.)

**Example:**
```
👤 A
Admin User
admin@trikut.com
[ADMIN] [MANAGER]
```

#### 2. Edit Profile Form

**What you can update:**

- **Full Name:** Your display name
- **Email Address:** Login email
- **Phone Number:** Contact number (optional)

**How to edit:**

1. **Modify the fields** you want to change

2. **Click "💾 Update Profile"**

3. **Success message appears**

4. **Changes saved** and reflected immediately

**Validation:**
- Email must be valid format
- Phone must be valid (if provided)
- Full name cannot be empty

#### 3. Change Password Section

**How to change password:**

1. **Enter Current Password**
   - Your existing password (for verification)

2. **Enter New Password**
   - At least 6 characters
   - Choose something secure

3. **Confirm New Password**
   - Must match new password exactly

4. **Click "🔐 Change Password"**

5. **Success!** Password updated

**Password Requirements:**
- Minimum 6 characters
- Must match in both fields
- Current password must be correct

**Security Note:**
After changing password, you may need to login again.

#### 4. Account Details Section

**Information shown:**
- User ID (your system identifier)
- Account Created date
- Account Status (Active/Inactive)

**Example:**
```
User ID: #1
Account Created: January 1, 2026
Status: Active ✅
```

### Returning to Dashboard

**Click "← Back to Dashboard"** button at top to return to where you came from.

---

## Common Workflows

### Workflow 1: Purchasing a New Asset

**Complete Process:**

1. **Login as Admin/Manager**

2. **Record Purchase Transaction:**
   - Go to "Record Transaction"
   - Type: BUY
   - Asset ID: (the asset you're buying)
   - Price: Purchase amount
   - Notes: "Purchase of [asset name]"
   - Click "Record Transaction"

3. **Create Asset Entry:**
   - Go to "Create Asset" form
   - Fill all details
   - Set depreciation if applicable
   - Owner ID: Assign to user
   - Click "Create Asset"

4. **Verify:**
   - Check Assets Table - new asset appears
   - Check Transactions - BUY transaction recorded
   - Check Reports - values updated

### Workflow 2: Selling an Asset

**Complete Process:**

1. **Find Asset ID** from Assets Table

2. **Record Sale Transaction:**
   - Type: SELL
   - Asset ID: The asset being sold
   - Price: Sale amount
   - From User: Current owner
   - To User: Buyer (if internal transfer)
   - Notes: Sale details
   - Click "Record Transaction"

3. **Option A - External Sale:**
   - Delete the asset from system
   - Click 🗑️ Delete button
   - Confirm deletion

4. **Option B - Internal Sale:**
   - Edit the asset
   - Change Owner ID to new owner
   - Update current value if changed
   - Save

5. **Print Receipt:**
   - Use console method to print receipt
   - Provide to buyer

### Workflow 3: Monthly Reporting

**Best Practice:**

1. **Login as Admin**

2. **Review Assets:**
   - Check all asset current values
   - Update any changed valuations
   - Verify depreciation calculations

3. **Generate Reports:**
   - Click "Load Reports"
   - Review all three reports:
     - Asset Utilization
     - Profit & Loss
     - Balance Sheet

4. **Export PDFs:**
   - Download all three reports
   - Save to company records
   - Share with stakeholders

5. **Analyze Performance:**
   - Check ROI trends
   - Review transaction volumes
   - Identify underperforming assets

### Workflow 4: Portfolio Review (Investor)

**Monthly/Quarterly Process:**

1. **Login as Investor**

2. **Check Portfolio Summary:**
   - Review total value
   - Check ROI
   - Note any major changes

3. **Analyze Risk Metrics:**
   - Check Risk Score
   - Review Diversification
   - Monitor Volatility
   - Read AI Insights

4. **Act on Recommendations:**
   - If diversification low → Consider new categories
   - If volatility high → Review risky assets
   - If ROI negative → Identify problem assets

5. **Make Decisions:**
   - Sell underperformers
   - Buy into growing sectors
   - Rebalance portfolio

---

## Tips & Best Practices

### For Administrators

✅ **Regular Maintenance:**
- Update asset values monthly
- Review depreciation calculations
- Clean up old transactions
- Archive inactive assets

✅ **Data Quality:**
- Use consistent asset codes (e.g., PROP-001, VEH-001)
- Add detailed notes to transactions
- Keep categories organized
- Document special cases

✅ **Security:**
- Change default passwords
- Review user access regularly
- Monitor unusual transactions
- Backup reports periodically

### For Managers

✅ **Team Management:**
- Assign assets to correct owners
- Track team asset usage
- Generate regular reports
- Communicate changes to team

✅ **Transaction Recording:**
- Record transactions immediately
- Include detailed notes
- Verify amounts carefully
- Print receipts for important transactions

### For Investors

✅ **Portfolio Monitoring:**
- Check dashboard weekly
- Review risk score monthly
- Act on AI insights
- Track ROI trends

✅ **Diversification:**
- Aim for 5+ asset categories
- Balance risk vs return
- Don't over-concentrate
- Review allocation quarterly

✅ **Performance:**
- Compare to benchmarks
- Identify patterns
- Learn from losses
- Celebrate wins

### General Best Practices

✅ **Browser:**
- Use modern updated browser
- Clear cache if issues occur
- Enable JavaScript
- Allow popups for receipts

✅ **Data Entry:**
- Double-check amounts
- Use proper formatting
- Be consistent with codes
- Add meaningful notes

✅ **Regular Tasks:**
- Login at least weekly
- Update values monthly
- Generate reports quarterly
- Review annually

✅ **Troubleshooting:**
- Refresh if page freezes
- Check both servers running
- Clear browser cache
- Restart servers if needed

---

## Keyboard Shortcuts

**Browser Shortcuts:**
- `F5` - Refresh page
- `Ctrl + P` - Print (for receipts)
- `F12` - Open developer console
- `Ctrl + -` / `Ctrl + +` - Zoom in/out

**Form Navigation:**
- `Tab` - Next field
- `Shift + Tab` - Previous field
- `Enter` - Submit form (on buttons)

---

## Frequently Asked Questions

### General Questions

**Q: What happens if I close the browser?**
A: You'll need to login again. Your data is saved on the server.

**Q: Can multiple users login at once?**
A: Yes! The system supports concurrent users.

**Q: How often is data saved?**
A: Immediately after every action (create, edit, delete, transaction).

### Asset Questions

**Q: Can I edit an asset after creating it?**
A: Yes! Click the ✏️ Edit button on any asset.

**Q: What if I delete an asset by mistake?**
A: Deletion is permanent. Be careful and use the confirmation dialog.

**Q: Do I have to add depreciation?**
A: No, it's optional. Select "No Depreciation" if not needed.

### Transaction Questions

**Q: Can I edit a transaction after recording?**
A: Currently no. Future versions will support transaction editing.

**Q: How do I print a receipt?**
A: Use the browser console method shown in the Receipts section.

**Q: What if I enter wrong amount?**
A: Contact admin to record a correction transaction.

### Portfolio Questions

**Q: Why is my risk score low?**
A: Low score = High risk. Check diversification and volatility.

**Q: How can I improve diversification?**
A: Invest in more asset categories (aim for 5+).

**Q: What's a good ROI?**
A: Depends on investment type, but 10%+ is generally good.

### Technical Questions

**Q: Why is the page not loading?**
A: Check that both servers are running (backend and frontend).

**Q: I get "Failed to fetch" errors**
A: Backend server isn't running. Start it on port 8080.

**Q: Can I use on mobile?**
A: Yes! The UI is responsive and works on mobile browsers.

---

## Getting Help

### Where to Look First

1. **This Guide** - Covers all features in detail
2. **README.md** - Setup and installation help
3. **QUICK_START.md** - Quick reference for testing
4. **Browser Console** - Check for error messages (F12)

### Common Solutions

**Problem:** Login not working
**Solution:** Check backend server running, clear browser cache

**Problem:** Assets not showing
**Solution:** Refresh page, verify you have permissions

**Problem:** PDF won't download
**Solution:** Enable downloads in browser, check popup blocker

**Problem:** Slow performance
**Solution:** Refresh page, restart servers, clear browser cache

---

## Glossary

**Asset:** Something of value owned by the organization

**Depreciation:** Reduction in asset value over time

**Book Value:** Current value after depreciation

**ROI:** Return on Investment - profit percentage

**Diversification:** Spreading investments across categories

**Volatility:** Measure of value fluctuation

**Portfolio:** Collection of all your assets

**Transaction:** Financial activity (buy, sell, transfer, withdraw)

**Risk Score:** Overall portfolio risk level (0-100)

**CRUD:** Create, Read, Update, Delete operations

**JWT:** JSON Web Token - for secure authentication

---

## Conclusion

**Congratulations!** You now know how to use every feature of the Finance Asset Management System.

**Remember:**
- ✅ Regular monitoring improves portfolio performance
- ✅ Diversification reduces risk
- ✅ Depreciation tracking ensures accurate valuation
- ✅ Reports provide valuable insights
- ✅ Profile management keeps information current

**Happy Asset Managing!** 🎉

---

**Document Version:** 1.0  
**Last Updated:** February 7, 2026  
**System Version:** FAMS v2.0
