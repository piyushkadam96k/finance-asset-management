const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// Mock Data
const mockUsers = [
  {
    id: 1,
    email: 'admin@fams.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN'
  },
  {
    id: 2,
    email: 'investor@fams.com',
    password: 'investor123',
    name: 'Rajesh Kumar',
    role: 'INVESTOR'
  },
  {
    id: 3,
    email: 'priya@fams.com',
    password: 'investor123',
    name: 'Priya Sharma',
    role: 'INVESTOR'
  },
  {
    id: 4,
    email: 'amit@fams.com',
    password: 'investor123',
    name: 'Amit Patel',
    role: 'INVESTOR'
  }
];

const mockAssets = [
  // Stocks
  {
    id: 1,
    name: 'Tesla Inc.',
    category: 'STOCK',
    purchasePrice: 50000,
    currentValue: 75000,
    quantity: 25,
    purchaseDate: '2023-01-15',
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Apple Inc.',
    category: 'STOCK',
    purchasePrice: 120000,
    currentValue: 155000,
    quantity: 50,
    purchaseDate: '2022-11-20',
    status: 'ACTIVE'
  },
  {
    id: 3,
    name: 'Reliance Industries',
    category: 'STOCK',
    purchasePrice: 85000,
    currentValue: 98000,
    quantity: 40,
    purchaseDate: '2023-03-10',
    status: 'ACTIVE'
  },
  {
    id: 4,
    name: 'Infosys Ltd.',
    category: 'STOCK',
    purchasePrice: 65000,
    currentValue: 72000,
    quantity: 35,
    purchaseDate: '2023-05-05',
    status: 'ACTIVE'
  },
  {
    id: 5,
    name: 'HDFC Bank',
    category: 'STOCK',
    purchasePrice: 95000,
    currentValue: 110000,
    quantity: 45,
    purchaseDate: '2022-12-15',
    status: 'ACTIVE'
  },

  // Real Estate
  {
    id: 6,
    name: 'Residential Property - Mumbai',
    category: 'REAL_ESTATE',
    purchasePrice: 8500000,
    currentValue: 9500000,
    quantity: 1,
    purchaseDate: '2021-06-20',
    status: 'ACTIVE'
  },
  {
    id: 7,
    name: 'Commercial Office - Bangalore',
    category: 'REAL_ESTATE',
    purchasePrice: 12000000,
    currentValue: 14500000,
    quantity: 1,
    purchaseDate: '2020-08-10',
    status: 'ACTIVE'
  },
  {
    id: 8,
    name: 'Plot in Pune',
    category: 'REAL_ESTATE',
    purchasePrice: 3500000,
    currentValue: 4200000,
    quantity: 1,
    purchaseDate: '2022-02-28',
    status: 'ACTIVE'
  },

  // Bonds
  {
    id: 9,
    name: 'Government Bonds 2025',
    category: 'BONDS',
    purchasePrice: 500000,
    currentValue: 525000,
    quantity: 50,
    purchaseDate: '2022-04-15',
    status: 'ACTIVE'
  },
  {
    id: 10,
    name: 'Corporate Bonds - Tata',
    category: 'BONDS',
    purchasePrice: 750000,
    currentValue: 795000,
    quantity: 75,
    purchaseDate: '2022-09-20',
    status: 'ACTIVE'
  },
  {
    id: 11,
    name: 'Municipal Bonds',
    category: 'BONDS',
    purchasePrice: 300000,
    currentValue: 315000,
    quantity: 30,
    purchaseDate: '2023-01-10',
    status: 'ACTIVE'
  },

  // Gold
  {
    id: 12,
    name: 'Gold ETF',
    category: 'COMMODITY',
    purchasePrice: 450000,
    currentValue: 520000,
    quantity: 100,
    purchaseDate: '2022-07-15',
    status: 'ACTIVE'
  },
  {
    id: 13,
    name: 'Physical Gold',
    category: 'COMMODITY',
    purchasePrice: 850000,
    currentValue: 920000,
    quantity: 150,
    purchaseDate: '2021-12-01',
    status: 'ACTIVE'
  },

  // Mutual Funds
  {
    id: 14,
    name: 'SBI Bluechip Fund',
    category: 'MUTUAL_FUND',
    purchasePrice: 250000,
    currentValue: 295000,
    quantity: 1000,
    purchaseDate: '2022-05-20',
    status: 'ACTIVE'
  },
  {
    id: 15,
    name: 'HDFC Mid-Cap Fund',
    category: 'MUTUAL_FUND',
    purchasePrice: 180000,
    currentValue: 215000,
    quantity: 800,
    purchaseDate: '2023-02-14',
    status: 'ACTIVE'
  },
  {
    id: 16,
    name: 'ICICI Balanced Fund',
    category: 'MUTUAL_FUND',
    purchasePrice: 320000,
    currentValue: 360000,
    quantity: 1200,
    purchaseDate: '2022-10-05',
    status: 'ACTIVE'
  },

  // Cryptocurrency
  {
    id: 17,
    name: 'Bitcoin',
    category: 'CRYPTO',
    purchasePrice: 1500000,
    currentValue: 2100000,
    quantity: 0.5,
    purchaseDate: '2022-03-15',
    status: 'ACTIVE'
  },
  {
    id: 18,
    name: 'Ethereum',
    category: 'CRYPTO',
    purchasePrice: 650000,
    currentValue: 820000,
    quantity: 5,
    purchaseDate: '2022-08-20',
    status: 'ACTIVE'
  },

  // Fixed Deposits
  {
    id: 19,
    name: 'Fixed Deposit - HDFC',
    category: 'FIXED_DEPOSIT',
    purchasePrice: 1000000,
    currentValue: 1065000,
    quantity: 1,
    purchaseDate: '2022-01-15',
    status: 'ACTIVE'
  },
  {
    id: 20,
    name: 'Fixed Deposit - SBI',
    category: 'FIXED_DEPOSIT',
    purchasePrice: 1500000,
    currentValue: 1597500,
    quantity: 1,
    purchaseDate: '2021-09-10',
    status: 'ACTIVE'
  }
];

const mockTransactions = [
  // Stock purchases
  { id: 1, assetId: 1, type: 'BUY', amount: 50000, quantity: 25, date: '2023-01-15', description: 'Initial Tesla stock purchase' },
  { id: 2, assetId: 2, type: 'BUY', amount: 120000, quantity: 50, date: '2022-11-20', description: 'Apple stock investment' },
  { id: 3, assetId: 3, type: 'BUY', amount: 85000, quantity: 40, date: '2023-03-10', description: 'Reliance Industries purchase' },
  { id: 4, assetId: 4, type: 'BUY', amount: 65000, quantity: 35, date: '2023-05-05', description: 'Infosys stock investment' },
  { id: 5, assetId: 5, type: 'BUY', amount: 95000, quantity: 45, date: '2022-12-15', description: 'HDFC Bank shares' },

  // Real estate
  { id: 6, assetId: 6, type: 'BUY', amount: 8500000, quantity: 1, date: '2021-06-20', description: 'Mumbai residential property purchase' },
  { id: 7, assetId: 7, type: 'BUY', amount: 12000000, quantity: 1, date: '2020-08-10', description: 'Bangalore commercial office' },
  { id: 8, assetId: 8, type: 'BUY', amount: 3500000, quantity: 1, date: '2022-02-28', description: 'Pune plot investment' },

  // Bonds
  { id: 9, assetId: 9, type: 'BUY', amount: 500000, quantity: 50, date: '2022-04-15', description: 'Government bonds purchase' },
  { id: 10, assetId: 10, type: 'BUY', amount: 750000, quantity: 75, date: '2022-09-20', description: 'Tata corporate bonds' },
  { id: 11, assetId: 11, type: 'BUY', amount: 300000, quantity: 30, date: '2023-01-10', description: 'Municipal bonds investment' },

  // Gold
  { id: 12, assetId: 12, type: 'BUY', amount: 450000, quantity: 100, date: '2022-07-15', description: 'Gold ETF purchase' },
  { id: 13, assetId: 13, type: 'BUY', amount: 850000, quantity: 150, date: '2021-12-01', description: 'Physical gold investment' },

  // Mutual funds
  { id: 14, assetId: 14, type: 'BUY', amount: 250000, quantity: 1000, date: '2022-05-20', description: 'SBI Bluechip Fund' },
  { id: 15, assetId: 15, type: 'BUY', amount: 180000, quantity: 800, date: '2023-02-14', description: 'HDFC Mid-Cap Fund' },
  { id: 16, assetId: 16, type: 'BUY', amount: 320000, quantity: 1200, date: '2022-10-05', description: 'ICICI Balanced Fund' },

  // Crypto
  { id: 17, assetId: 17, type: 'BUY', amount: 1500000, quantity: 0.5, date: '2022-03-15', description: 'Bitcoin investment' },
  { id: 18, assetId: 18, type: 'BUY', amount: 650000, quantity: 5, date: '2022-08-20', description: 'Ethereum purchase' },

  // Fixed deposits
  { id: 19, assetId: 19, type: 'BUY', amount: 1000000, quantity: 1, date: '2022-01-15', description: 'HDFC Fixed Deposit' },
  { id: 20, assetId: 20, type: 'BUY', amount: 1500000, quantity: 1, date: '2021-09-10', description: 'SBI Fixed Deposit' },

  // Some sell transactions
  { id: 21, assetId: 1, type: 'SELL', amount: 15000, quantity: 5, date: '2024-01-10', description: 'Partial Tesla stock sale' },
  { id: 22, assetId: 3, type: 'SELL', amount: 12000, quantity: 5, date: '2024-01-25', description: 'Booked profit on Reliance' },
];

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      token: 'mock-jwt-token-' + user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
    name,
    role: 'INVESTOR'
  };
  mockUsers.push(newUser);

  res.json({
    token: 'mock-jwt-token-' + newUser.id,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
});

// Categories Endpoint (for admin dropdown)
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'STOCK' },
    { id: 2, name: 'REAL_ESTATE' },
    { id: 3, name: 'BONDS' },
    { id: 4, name: 'COMMODITY' },
    { id: 5, name: 'MUTUAL_FUND' },
    { id: 6, name: 'CRYPTO' },
    { id: 7, name: 'FIXED_DEPOSIT' }
  ];
  res.json(categories);
});

// User Endpoints
app.get('/api/users/me', (req, res) => {
  res.json({
    ...mockUsers[0],
    fullName: mockUsers[0].name,
    roles: [{ name: mockUsers[0].role }]
  });
});

app.get('/api/users', (req, res) => {
  const usersWithRoles = mockUsers.map(u => ({
    ...u,
    fullName: u.name,
    roles: [{ name: u.role }]
  }));
  res.json(usersWithRoles);
});

// Asset Endpoints
app.get('/api/assets', (req, res) => {
  const assetsWithCategory = mockAssets.map(a => ({
    ...a,
    assetCode: `AST${String(a.id).padStart(3, '0')}`,
    category: { id: a.id, name: a.category }
  }));
  res.json(assetsWithCategory);
});

app.get('/api/assets/:id', (req, res) => {
  const asset = mockAssets.find(a => a.id === parseInt(req.params.id));
  if (asset) {
    res.json({
      ...asset,
      assetCode: `AST${String(asset.id).padStart(3, '0')}`,
      category: { id: asset.id, name: asset.category }
    });
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

app.post('/api/assets', (req, res) => {
  const newAsset = {
    id: mockAssets.length + 1,
    ...req.body,
    status: 'ACTIVE'
  };
  mockAssets.push(newAsset);
  res.status(201).json(newAsset);
});

app.put('/api/assets/:id', (req, res) => {
  const index = mockAssets.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    mockAssets[index] = { ...mockAssets[index], ...req.body };
    res.json(mockAssets[index]);
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

app.delete('/api/assets/:id', (req, res) => {
  const index = mockAssets.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    mockAssets.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

app.put('/api/assets/:id/valuation', (req, res) => {
  const index = mockAssets.findIndex(a => a.id === parseInt(req.params.id));
  if (index !== -1) {
    mockAssets[index].currentValue = req.body.currentValue;
    res.json(mockAssets[index]);
  } else {
    res.status(404).json({ message: 'Asset not found' });
  }
});

// Transaction Endpoints
app.get('/api/transactions', (req, res) => {
  const txsWithAsset = mockTransactions.map(t => ({
    ...t,
    referenceNo: `TXN${String(t.id).padStart(5, '0')}`,
    asset: mockAssets.find(a => a.id === t.assetId),
    transactionDate: t.date
  }));
  res.json(txsWithAsset);
});

app.post('/api/transactions', (req, res) => {
  const newTransaction = {
    id: mockTransactions.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  mockTransactions.push(newTransaction);
  res.status(201).json({
    ...newTransaction,
    referenceNo: `TXN${String(newTransaction.id).padStart(5, '0')}`,
    asset: mockAssets.find(a => a.id === newTransaction.assetId),
    transactionDate: newTransaction.date
  });
});

// Portfolio Endpoints
app.get('/api/portfolio/summary/:userId', (req, res) => {
  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalInvestment = mockAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  const roi = ((totalValue - totalInvestment) / totalInvestment * 100).toFixed(2);

  res.json({
    userId: parseInt(req.params.userId),
    totalAssets: mockAssets.length,
    totalValue: totalValue,
    totalInvestment: totalInvestment,
    roi: parseFloat(roi),
    assetBreakdown: {
      STOCK: mockAssets.filter(a => a.category === 'STOCK').reduce((sum, a) => sum + a.currentValue, 0),
      REAL_ESTATE: mockAssets.filter(a => a.category === 'REAL_ESTATE').reduce((sum, a) => sum + a.currentValue, 0),
      BONDS: mockAssets.filter(a => a.category === 'BONDS').reduce((sum, a) => sum + a.currentValue, 0)
    }
  });
});

// Report Endpoints
app.get('/api/reports/asset-utilization', (req, res) => {
  res.json({
    report: 'Asset Utilization Report',
    data: mockAssets.map(asset => ({
      name: asset.name,
      category: asset.category,
      utilization: '85%',
      status: asset.status
    }))
  });
});

app.get('/api/reports/profit-loss', (req, res) => {
  const totalProfit = mockAssets.reduce((sum, asset) =>
    sum + (asset.currentValue - asset.purchasePrice), 0
  );

  res.json({
    report: 'Profit & Loss Report',
    totalProfit: totalProfit,
    totalLoss: 0,
    netProfitLoss: totalProfit,
    breakdown: mockAssets.map(asset => ({
      assetName: asset.name,
      profit: asset.currentValue - asset.purchasePrice,
      percentageChange: (((asset.currentValue - asset.purchasePrice) / asset.purchasePrice) * 100).toFixed(2)
    }))
  });
});

app.get('/api/reports/balance-sheet', (req, res) => {
  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalLiabilities = 0;

  res.json({
    report: 'Balance Sheet',
    totalAssets: totalAssets,
    totalLiabilities: totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    date: new Date().toISOString().split('T')[0]
  });
});

app.get('/api/reports/asset-utilization/pdf', (req, res) => {
  res.json({ message: 'PDF generation would happen here in the real backend' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock FAMS backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock FAMS Backend running on http://localhost:${PORT}`);
  console.log(`📊 Ready to serve frontend at http://localhost:5500`);
  console.log(`\nTest credentials:`);
  console.log(`  Admin: admin@fams.com / admin123`);
  console.log(`  Investor: investor@fams.com / investor123`);
});
