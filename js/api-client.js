// ============================================
// API CLIENT - Backend API İletişimi
// ============================================

const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  // Production'da: 'https://your-domain.com/api'
};

// Token yönetimi
let authToken = null;

/**
 * Token'ı localStorage'dan yükle
 */
function loadAuthToken() {
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('hasene_auth_token');
    
    // URL'den token varsa al (Google OAuth callback'ten sonra)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      authToken = tokenFromUrl;
      localStorage.setItem('hasene_auth_token', tokenFromUrl);
      // URL'den token'ı temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
  return authToken;
}

/**
 * Token'ı kaydet
 */
function saveAuthToken(token) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasene_auth_token', token);
  }
}

/**
 * Token'ı sil
 */
function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hasene_auth_token');
  }
}

/**
 * API isteği yap
 */
async function apiRequest(endpoint, options = {}) {
  const token = loadAuthToken();
  
  if (!token && !endpoint.includes('/auth/google')) {
    throw new Error('Not authenticated. Please login.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized - token geçersiz veya süresi dolmuş
      clearAuthToken();
      window.location.href = '/login.html';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      // Network error - backend'e bağlanılamıyor
      warnLog('Backend bağlantı hatası. Offline moda geçiliyor...');
      throw new Error('NETWORK_ERROR');
    }
    throw error;
  }
}

// ============================================
// AUTH API
// ============================================

/**
 * Google ile giriş yap
 */
function loginWithGoogle() {
  window.location.href = `${API_CONFIG.BASE_URL}/auth/google`;
}

/**
 * Çıkış yap
 */
async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
    clearAuthToken();
    window.location.href = '/';
  } catch (error) {
    errorLog('Logout error:', error);
    clearAuthToken();
    window.location.href = '/';
  }
}

/**
 * Mevcut kullanıcıyı al
 */
async function getCurrentUser() {
  try {
    return await apiRequest('/auth/me');
  } catch (error) {
    return null;
  }
}

// ============================================
// STATS API
// ============================================

/**
 * Kullanıcı istatistiklerini yükle
 */
async function loadUserStats() {
  try {
    return await apiRequest('/stats');
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod - localStorage'dan yükle
      warnLog('Backend offline, localStorage kullanılıyor');
      return loadStatsFromLocalStorage();
    }
    throw error;
  }
}

/**
 * Kullanıcı istatistiklerini kaydet
 */
async function saveUserStats(statsData) {
  try {
    // Backend'e kaydet
    const response = await apiRequest('/stats', {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
    
    // Başarılı olursa localStorage'a da yedek olarak kaydet
    saveStatsToLocalStorage(statsData);
    
    return response;
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod - sadece localStorage'a kaydet
      warnLog('Backend offline, localStorage\'a kaydediliyor');
      saveStatsToLocalStorage(statsData);
      return statsData;
    }
    throw error;
  }
}

/**
 * Belirli bir stat alanını güncelle
 */
async function updateStatField(field, value) {
  try {
    return await apiRequest(`/stats/${field}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod - localStorage'a kaydet
      const stats = loadStatsFromLocalStorage();
      stats[field] = value;
      saveStatsToLocalStorage(stats);
      return stats;
    }
    throw error;
  }
}

// ============================================
// FAVORITES API
// ============================================

/**
 * Favori kelimeleri yükle
 */
async function loadFavoritesFromAPI() {
  try {
    const favorites = await apiRequest('/favorites');
    return new Set(favorites);
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod
      const favorites = safeGetItem('hasene_favoriteWords', []);
      return new Set(favorites);
    }
    throw error;
  }
}

/**
 * Favori kelime ekle
 */
async function addFavoriteToAPI(wordId) {
  try {
    const response = await apiRequest(`/favorites/${wordId}`, {
      method: 'POST',
    });
    return response.favoriteWords || [];
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod
      const favorites = safeGetItem('hasene_favoriteWords', []);
      if (!favorites.includes(wordId)) {
        favorites.push(wordId);
        safeSetItem('hasene_favoriteWords', favorites);
      }
      return favorites;
    }
    throw error;
  }
}

/**
 * Favori kelime çıkar
 */
async function removeFavoriteFromAPI(wordId) {
  try {
    const response = await apiRequest(`/favorites/${wordId}`, {
      method: 'DELETE',
    });
    return response.favoriteWords || [];
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod
      const favorites = safeGetItem('hasene_favoriteWords', []);
      const filtered = favorites.filter(id => id !== wordId);
      safeSetItem('hasene_favoriteWords', filtered);
      return filtered;
    }
    throw error;
  }
}

/**
 * Favori kelime toggle
 */
async function toggleFavoriteAPI(wordId) {
  try {
    const response = await apiRequest(`/favorites/toggle/${wordId}`, {
      method: 'POST',
    });
    return response.isFavorite;
  } catch (error) {
    if (error.message === 'NETWORK_ERROR') {
      // Offline mod
      const favorites = safeGetItem('hasene_favoriteWords', []);
      const index = favorites.indexOf(wordId);
      if (index !== -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(wordId);
      }
      safeSetItem('hasene_favoriteWords', favorites);
      return favorites.includes(wordId);
    }
    throw error;
  }
}

// ============================================
// LOCALSTORAGE FALLBACK (Offline Support)
// ============================================

/**
 * localStorage'dan istatistikleri yükle (yedek)
 */
function loadStatsFromLocalStorage() {
  const stats = {
    totalPoints: parseInt(localStorage.getItem('hasene_totalPoints') || '0') || 0,
    badges: safeGetItem('hasene_badges', {
      stars: 0,
      bronze: 0,
      silver: 0,
      gold: 0,
      diamond: 0
    }),
    streakData: safeGetItem('hasene_streakData', {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayDate: null,
      streakHistory: []
    }),
    dailyTasks: safeGetItem('hasene_dailyTasks', {
      todayStats: {
        allGameModes: [],
        farklıZorluk: [],
        reviewWords: [],
        ayetOku: 0,
        duaEt: 0,
        hadisOku: 0
      }
    }),
    weeklyTasks: safeGetItem('hasene_weeklyTasks', {
      weekStats: {
        allModesPlayed: []
      }
    }),
    wordStats: safeGetItem('hasene_wordStats', {}),
    unlockedAchievements: safeGetItem('unlockedAchievements', []),
    unlockedBadges: safeGetItem('unlockedBadges', []),
    perfectLessonsCount: parseInt(safeGetItem('perfectLessonsCount', 0)) || 0,
    gameStats: safeGetItem('gameStats', {
      totalCorrect: 0,
      totalWrong: 0,
      gameModeCounts: {
        'kelime-cevir': 0,
        'dinle-bul': 0,
        'bosluk-doldur': 0,
        'ayet-oku': 0,
        'dua-et': 0,
        'hadis-oku': 0
      }
    }),
    favoriteWords: safeGetItem('hasene_favoriteWords', []),
    dailyGoalHasene: parseInt(localStorage.getItem('dailyGoalHasene') || '2700'),
    dailyGoalLevel: localStorage.getItem('dailyGoalLevel') || 'normal',
    dailyCorrect: parseInt(localStorage.getItem('dailyCorrect') || '0'),
    dailyWrong: parseInt(localStorage.getItem('dailyWrong') || '0'),
    dailyXP: parseInt(localStorage.getItem('dailyXP') || '0'),
    lastDailyGoalDate: localStorage.getItem('lastDailyGoalDate'),
    onboardingSeen: localStorage.getItem('hasene_onboarding_seen_v2') === 'true'
  };

  return stats;
}

/**
 * localStorage'a istatistikleri kaydet (yedek)
 */
function saveStatsToLocalStorage(stats) {
  localStorage.setItem('hasene_totalPoints', (stats.totalPoints || 0).toString());
  safeSetItem('hasene_badges', stats.badges || {});
  safeSetItem('hasene_streakData', stats.streakData || {});
  safeSetItem('hasene_dailyTasks', stats.dailyTasks || {});
  safeSetItem('hasene_weeklyTasks', stats.weeklyTasks || {});
  safeSetItem('hasene_wordStats', stats.wordStats || {});
  safeSetItem('unlockedAchievements', stats.unlockedAchievements || []);
  safeSetItem('unlockedBadges', stats.unlockedBadges || []);
  safeSetItem('perfectLessonsCount', stats.perfectLessonsCount || 0);
  safeSetItem('gameStats', stats.gameStats || {});
  safeSetItem('hasene_favoriteWords', stats.favoriteWords || []);
  
  if (stats.dailyGoalHasene) {
    localStorage.setItem('dailyGoalHasene', stats.dailyGoalHasene.toString());
  }
  if (stats.dailyGoalLevel) {
    localStorage.setItem('dailyGoalLevel', stats.dailyGoalLevel);
  }
  if (stats.dailyCorrect !== undefined) {
    localStorage.setItem('dailyCorrect', stats.dailyCorrect.toString());
  }
  if (stats.dailyWrong !== undefined) {
    localStorage.setItem('dailyWrong', stats.dailyWrong.toString());
  }
  if (stats.dailyXP !== undefined) {
    localStorage.setItem('dailyXP', stats.dailyXP.toString());
  }
  if (stats.lastDailyGoalDate) {
    localStorage.setItem('lastDailyGoalDate', stats.lastDailyGoalDate);
  }
  if (stats.onboardingSeen) {
    localStorage.setItem('hasene_onboarding_seen_v2', 'true');
  }
}

// Sayfa yüklendiğinde token'ı yükle
if (typeof window !== 'undefined') {
  loadAuthToken();
}

// Export
if (typeof window !== 'undefined') {
  window.API_CONFIG = API_CONFIG;
  window.loadAuthToken = loadAuthToken;
  window.saveAuthToken = saveAuthToken;
  window.clearAuthToken = clearAuthToken;
  window.loginWithGoogle = loginWithGoogle;
  window.logout = logout;
  window.getCurrentUser = getCurrentUser;
  window.loadUserStats = loadUserStats;
  window.saveUserStats = saveUserStats;
  window.updateStatField = updateStatField;
  window.loadFavoritesFromAPI = loadFavoritesFromAPI;
  window.addFavoriteToAPI = addFavoriteToAPI;
  window.removeFavoriteFromAPI = removeFavoriteFromAPI;
  window.toggleFavoriteAPI = toggleFavoriteAPI;
}

