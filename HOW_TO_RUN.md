# 🚀 How to Run FAMS on Your PC

**Super Simple — Just 2 Steps!**

---

## ✅ **Quick Start**

### **Step 1: Open PowerShell**
Press `Windows + X` → Choose "Windows PowerShell" or "Terminal"

### **Step 2: Start the Server**
```powershell
cd C:\Users\kadam\Downloads\finance-asset-management\finance-asset-management\mock-backend
npm start
```

✅ **Wait for:** `🚀 FAMS is running at http://localhost:8080`

### **Step 3: Open in Browser**
Go to: **http://localhost:8080**

Login with: **admin@trikut.com / password**

> **⚠️ IMPORTANT:** Do NOT open the HTML files directly from your file explorer!
> You MUST use the URL http://localhost:8080 in your browser.
> Opening files directly (file://) will cause login failures and crashes.

---

## 👥 **Login Accounts**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@trikut.com | password |
| Manager | manager@trikut.com | password |
| Employee | employee@trikut.com | password |
| Investor | investor@trikut.com | password |

---

## 🌐 **Access URLs**

| What | URL |
|------|-----|
| **Login Page** | http://localhost:8080 |
| **Admin Dashboard** | http://localhost:8080/admin.html |
| **Manager Dashboard** | http://localhost:8080/manager.html |
| **Investor Dashboard** | http://localhost:8080/investor.html |
| **Employee Dashboard** | http://localhost:8080/employee.html |
| **Profile Page** | http://localhost:8080/profile.html |
| **Health Check** | http://localhost:8080/health |

---

## ⚠️ **Troubleshooting**

### **Problem: "npm not found"**
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Try again

### **Problem: "Cannot find module"**
```powershell
cd mock-backend
npm install
npm start
```

### **Problem: Port already in use**
```powershell
netstat -ano | findstr :8080
taskkill /PID [PID_NUMBER] /F
```

### **Problem: Login not working / Page crashing**
- Make sure you are using **http://localhost:8080** (NOT opening files directly)
- Make sure the server is running (you should see the startup message)
- Try clearing browser cache: Ctrl + Shift + Delete

---

## 🛑 **How to Stop**

In the PowerShell window: Press **Ctrl + C**

---

*Simple. One server. Ready to go!* 🚀
