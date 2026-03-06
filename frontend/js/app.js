// Auto-detect API base: use same origin if served from backend, otherwise fallback to localhost:8080
const API_BASE = (window.location.port === '8080' || window.location.port === '')
    ? window.location.origin + '/api'
    : 'http://localhost:8080/api';

function setToken(token) {
    localStorage.setItem("token", token);
}
function getToken() {
    return localStorage.getItem("token");
}
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-message">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Loading overlay
let activeRequestCount = 0;
let loadingTimeout = null;

function showLoading() {
    activeRequestCount++;
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    }

    // Clear any pending hides
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }

    // Immediate show if not already showing
    if (!overlay.classList.contains('show')) {
        overlay.classList.add('show');
    }
}

function hideLoading() {
    activeRequestCount = Math.max(0, activeRequestCount - 1);

    if (activeRequestCount === 0) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            // Tiny delay to prevent flashing between immediate sequential requests
            loadingTimeout = setTimeout(() => {
                if (activeRequestCount === 0) {
                    overlay.classList.remove('show');
                }
            }, 50);
        }
    }
}

async function apiRequest(path, method = "GET", body = null, retries = 2) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(`${API_BASE}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });

            if (!res.ok) {
                const msg = await res.text();

                // Handle specific error codes
                if (res.status === 401) {
                    showToast('Invalid credentials or session expired.', 'error');
                    if (path !== "/auth/login") {
                        setTimeout(() => logout(), 1500);
                    }
                    throw new Error('Unauthorized');
                }

                if (res.status === 403) {
                    showToast('You do not have permission to perform this action.', 'error');
                    throw new Error('Forbidden');
                }

                if (res.status >= 500 && attempt < retries) {
                    // Retry server errors
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                    continue;
                }

                throw new Error(msg || `Request failed with status ${res.status}`);
            }

            if (res.status === 204) return null;
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) return res.json();
            return res.text();

        } catch (err) {
            if (err.message === 'Unauthorized' || err.message === 'Forbidden') {
                throw err;
            }

            if (attempt === retries) {
                // All retries exhausted
                if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
                    showToast('Network error. Please check your connection.', 'error');
                    throw new Error('Network error');
                }

                showToast(err.message || 'An error occurred', 'error');
                throw err;
            }
        }
    }
}

async function apiDownload(path, filename) {
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { method: "GET", headers });
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Download failed");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    let isSubmitting = false;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const msg = document.getElementById("loginMsg");
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            showLoading();

            const data = await apiRequest("/auth/login", "POST", { email, password });
            setToken(data.token);

            showToast('Login successful!', 'success');

            setTimeout(() => {
                if (data.user.role.includes("INVESTOR")) {
                    window.location.href = "investor.html";
                } else if (data.user.role.includes("MANAGER")) {
                    window.location.href = "manager.html";
                } else if (data.user.role.includes("EMPLOYEE")) {
                    window.location.href = "employee.html";
                } else {
                    // Admin or other generic roles
                    window.location.href = "admin.html";
                }
            }, 500);
        } catch (err) {
            msg.innerText = err.message || "Login failed";
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isSubmitting = false;
            hideLoading();
        }
    });
}
