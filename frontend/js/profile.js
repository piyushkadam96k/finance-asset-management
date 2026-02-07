// Load and display user profile
async function loadProfile() {
    const profileInfo = document.getElementById("profileInfo");
    const accountDetails = document.getElementById("accountDetails");

    try {
        showLoading();
        const user = await apiRequest("/users/me");

        // Display profile info
        if (profileInfo) {
            const roles = (user.roles || []).map(r => r.name || r).join(", ");
            profileInfo.innerHTML = `
                <div style="display: grid; gap: 16px; padding: 20px; background: var(--bg-dark); border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; font-weight: bold;">
                            ${user.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">${user.fullName || 'User'}</h2>
                            <p style="margin: 4px 0; color: var(--text-secondary);">${user.email || 'No email'}</p>
                            <p style="margin: 4px 0;"><span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 4px; font-size: 0.85rem;">${roles || 'No role'}</span></p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Pre-fill edit form
        document.getElementById("fullName").value = user.fullName || '';
        document.getElementById("email").value = user.email || '';
        document.getElementById("phone").value = user.phone || '';

        // Display account details
        if (accountDetails) {
            const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
            accountDetails.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div style="padding: 16px; background: var(--bg-dark); border-radius: 6px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">User ID</div>
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">#${user.id || 'N/A'}</div>
                    </div>
                    <div style="padding: 16px; background: var(--bg-dark); border-radius: 6px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Account Created</div>
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">${createdDate}</div>
                    </div>
                    <div style="padding: 16px; background: var(--bg-dark); border-radius: 6px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Status</div>
                        <div style="font-size: 1.25rem; font-weight: 600; color: var(--success);">✓ Active</div>
                    </div>
                </div>
            `;
        }

    } catch (err) {
        console.error("Failed to load profile:", err);
        if (profileInfo) {
            profileInfo.innerHTML = '<div class="empty-state-text">Failed to load profile</div>';
        }
        showToast('Failed to load profile', 'error');
    } finally {
        hideLoading();
    }
}

// Handle profile update form
const profileForm = document.getElementById("profileForm");
if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const msg = document.getElementById("profileMsg");

        const updateData = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value || null
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Updating...';
            showLoading();

            await apiRequest("/users/me", "PUT", updateData);

            if (msg) msg.textContent = "✅ Profile updated successfully!";
            showToast('Profile updated successfully!', 'success');

            // Reload profile to show changes
            await loadProfile();
        } catch (err) {
            console.error("Failed to update profile:", err);
            if (msg) msg.textContent = `❌ ${err.message || "Failed to update profile"}`;
            showToast(err.message || 'Failed to update profile', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            hideLoading();
        }
    });
}

// Handle password change form
const passwordForm = document.getElementById("passwordForm");
if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const msg = document.getElementById("passwordMsg");

        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            if (msg) msg.textContent = "❌ New passwords do not match!";
            showToast('New passwords do not match!', 'error');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            if (msg) msg.textContent = "❌ New password must be at least 6 characters!";
            showToast('New password must be at least 6 characters!', 'error');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Changing...';
            showLoading();

            await apiRequest("/users/me/password", "PUT", {
                currentPassword,
                newPassword
            });

            if (msg) msg.textContent = "✅ Password changed successfully!";
            showToast('Password changed successfully!', 'success');

            // Reset form
            passwordForm.reset();
        } catch (err) {
            console.error("Failed to change password:", err);
            if (msg) msg.textContent = `❌ ${err.message || "Failed to change password"}`;
            showToast(err.message || 'Failed to change password', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            hideLoading();
        }
    });
}

// Initialize profile page
if (document.getElementById("profileInfo")) {
    setTimeout(() => {
        loadProfile();
    }, 100);
}
