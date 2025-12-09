// ============================================
// AUTH UI - Kullanıcı Arayüzü Yönetimi
// ============================================

/**
 * Kullanıcı giriş durumunu kontrol et ve UI'ı güncelle
 */
async function initAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userAuthSection = document.getElementById('user-auth-section');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (!userAuthSection) return;
    
    // Token kontrolü
    const token = loadAuthToken();
    
    if (token && typeof getCurrentUser === 'function') {
        try {
            const user = await getCurrentUser();
            if (user) {
                // Kullanıcı giriş yapmış
                if (loginBtn) loginBtn.style.display = 'none';
                if (userProfile) {
                    userProfile.style.display = 'block';
                    if (userAvatar && user.picture) {
                        userAvatar.src = user.picture;
                        userAvatar.alt = user.name;
                    }
                    if (userName) {
                        userName.textContent = user.name || user.email;
                    }
                }
                if (userAuthSection) userAuthSection.style.display = 'flex';
            } else {
                // Token geçersiz
                showLoginButton();
            }
        } catch (error) {
            console.error('User fetch error:', error);
            showLoginButton();
        }
    } else {
        // Giriş yapılmamış
        showLoginButton();
    }
    
    // Login butonu event listener
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (typeof loginWithGoogle === 'function') {
                loginWithGoogle();
            }
        });
    }
    
    // Logout butonu event listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (typeof logout === 'function') {
                await logout();
            } else {
                clearAuthToken();
                window.location.reload();
            }
        });
    }
}

/**
 * Login butonunu göster
 */
function showLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userAuthSection = document.getElementById('user-auth-section');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'none';
    if (userAuthSection) userAuthSection.style.display = 'flex';
}

// Sayfa yüklendiğinde auth UI'ı başlat
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthUI);
    } else {
        initAuthUI();
    }
}

// Export
if (typeof window !== 'undefined') {
    window.initAuthUI = initAuthUI;
    window.showLoginButton = showLoginButton;
}

