# 🚀 How to Run FAMS on Your PC

**Simple 3-Step Guide**

---

## ✅ **GOOD NEWS: Already Running!**

Your servers are **already running**! Just open your browser.

**Go to:** http://localhost:5500/index.html

**Login:** admin@trikut.com / password

---

## 📖 **Starting from Scratch**

If you need to start the servers:

### **Step 1: Open PowerShell**

Press `Windows + X` → Choose "Windows PowerShell" or "Terminal"

### **Step 2: Navigate to Project**

```powershell
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management
```

### **Step 3: Start Backend Server**

```powershell
cd mock-backend
npm start
```

✅ **Wait for:** `🚀 Mock FAMS Backend running on http://localhost:8080`

### **Step 4: Start Frontend Server** (New Terminal)

Open **another PowerShell window** and run:

```powershell
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management\frontend
python -m http.server 5500
```

✅ **Wait for:** `Serving HTTP on :: port 5500`

### **Step 5: Open in Browser**

1. Open **Chrome, Firefox, or Edge**
2. Go to: **http://localhost:5500/index.html**
3. Login with: **admin@trikut.com / password**

---

## 🎯 **Quick Commands**

### **One-Command Start (PowerShell)**

**Terminal 1 - Backend:**
```powershell
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management\mock-backend; npm start
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management\frontend; python -m http.server 5500
```

---

## 🔍 **Check if Running**

### **Backend Check:**
Open browser → Go to: http://localhost:8080/api/health

**Expected:** JSON response or error message

### **Frontend Check:**
Open browser → Go to: http://localhost:5500

**Expected:** Should see file listing or login page

---

## ⚠️ **Troubleshooting**

### **Problem: "npm not found"**
**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Try again

### **Problem: "python not found"**
**Solution:**
1. Install Python from https://www.python.org/
2. During installation, check "Add Python to PATH"
3. Restart PowerShell
4. Try: `python3 -m http.server 5500` instead

### **Problem: Port already in use**
**Solution:**
```powershell
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F

# Kill process on port 5500
netstat -ano | findstr :5500
taskkill /PID [PID_NUMBER] /F
```

### **Problem: "Cannot find module"**
**Solution:**
```powershell
cd mock-backend
npm install
npm start
```

### **Problem: Page won't load**
**Solutions:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Try incognito/private mode
3. Check both servers are running
4. Try different browser

---

## 🛑 **How to Stop Servers**

In each PowerShell window:
- Press **Ctrl + C**
- Type **Y** and press Enter

---

## 🌐 **Access URLs**

| What | URL |
|------|-----|
| **Login Page** | http://localhost:5500/index.html |
| **Admin Dashboard** | http://localhost:5500/admin.html |
| **Manager Dashboard** | http://localhost:5500/manager.html |
| **Investor Dashboard** | http://localhost:5500/investor.html |
| **Profile Page** | http://localhost:5500/profile.html |
| **Backend API** | http://localhost:8080/api |

---

## 👥 **Login Accounts**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trikut.com | password |
| Manager | manager@trikut.com | password |
| Employee | employee@trikut.com | password |
| Investor | investor@trikut.com | password |

---

## 📱 **Running on Different Device**

### **Same Network (LAN):**

1. Find your PC's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On other device, open browser:
   ```
   http://[YOUR_IP]:5500/index.html
   ```
   Example: http://192.168.1.100:5500/index.html

3. **Note:** Backend stays localhost:8080 (edit if needed)

---

## 💾 **Save for Later**

**Copy this to run anytime:**

```powershell
# Open 2 PowerShell windows

# Window 1:
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management\mock-backend
npm start

# Window 2:
cd C:\Users\kadam\OneDrive\Documents\finace\finance-asset-management\frontend
python -m http.server 5500

# Then open: http://localhost:5500/index.html
```

---

## ✅ **Success Checklist**

- [ ] Node.js installed
- [ ] Python installed
- [ ] Backend server running (port 8080)
- [ ] Frontend server running (port 5500)
- [ ] Browser open to http://localhost:5500/index.html
- [ ] Logged in successfully

---

## 🎓 **Next Steps**

After running:
1. **Test Login** - Use admin credentials
2. **Create Asset** - Try adding a test asset
3. **View Dashboard** - Explore different dashboards
4. **Read USER_GUIDE.md** - Learn all features

---

**Need More Help?**
- Check **README.md** for installation
- Read **USER_GUIDE.md** for features
- See **QUICK_START.md** for testing

---

*Simple. Fast. Ready to go!* 🚀
