// ============================================
// 🏅 Rozet Görselleştirme ve Animasyonlar
// ============================================
// Bu dosya, rozet sistemini görselleştirir ve kazanma animasyonları ekler

(function() {
    'use strict';

    // Rozet görsel eşleştirmeleri (emoji veya SVG)
    const badgeVisuals = {
        // Günlük Başarılar
        'achievement-first_win': { emoji: '📿', color: '#FFD700', glow: '#FFA500' },
        'achievement-daily_goal': { emoji: '☪', color: '#FFD700', glow: '#FFA500' },
        
        // Özel Başarılar
        'achievement-combo_master': { emoji: '🤲', color: '#FF6B35', glow: '#FF8C42' },
        'achievement-xp_500': { emoji: '🌱', color: '#4CAF50', glow: '#66BB6A' },
        'achievement-xp_2000': { emoji: '🕌', color: '#CD7F32', glow: '#D4AF37' },
        'achievement-xp_8500': { emoji: '🕋', color: '#C0C0C0', glow: '#E8E8E8' },
        'achievement-xp_25500': { emoji: '☪', color: '#FFD700', glow: '#FFA500' },
        'achievement-xp_85000': { emoji: '📿', color: '#B9F2FF', glow: '#E0F7FA' },
        'achievement-xp_1000000': { emoji: '📖', color: '#8E24AA', glow: '#E1BEE7' }, // HAFIZ
        
        // Seri Başarılar
        'achievement-streak_7': { emoji: '📿', color: '#FF6B35', glow: '#FF8C42' },
        'achievement-streak_30': { emoji: '☪', color: '#FFD700', glow: '#FFA500' },
        
        // Mertebe Başarılar
        'achievement-level_5': { emoji: '🕌', color: '#FFD700', glow: '#FFA500' },
        'achievement-level_10': { emoji: '👳', color: '#FFD700', glow: '#FFA500' },
    };

    // Rozet kazanma animasyon stilleri
    const badgeAnimationStyles = `
        <style id="badge-visualization-styles">
            /* Rozet Kazanma Animasyonu */
            @keyframes badgeUnlock {
                0% {
                    transform: scale(0) rotate(-180deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.3) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
            }

            @keyframes badgeGlow {
                0%, 100% {
                    box-shadow: 0 0 10px var(--badge-glow, rgba(255, 215, 0, 0.5));
                }
                50% {
                    box-shadow: 0 0 30px var(--badge-glow, rgba(255, 215, 0, 0.8));
                }
            }

            @keyframes badgePulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }

            /* Rozet kartı animasyonları */
            .badge-card.unlocked {
                animation: badgeUnlock 0.8s ease-out;
            }

            .badge-card.unlocked .badge-icon {
                animation: badgePulse 2s ease-in-out infinite;
                filter: drop-shadow(0 0 10px var(--badge-glow, rgba(255, 215, 0, 0.5)));
            }

            .badge-card.unlocked {
                background: linear-gradient(135deg, var(--badge-color, #fff) 0%, var(--badge-glow, #fff) 100%);
                border: 2px solid var(--badge-color, #FFD700);
            }

            /* Rozet kazanma popup */
            .badge-unlock-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                animation: badgeUnlock 0.8s ease-out;
                max-width: 300px;
            }

            .badge-unlock-popup .badge-icon-large {
                font-size: 64px;
                margin-bottom: 10px;
                animation: badgePulse 2s ease-in-out infinite;
            }

            .badge-unlock-popup .badge-title-large {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .badge-unlock-popup .badge-desc-large {
                font-size: 16px;
                opacity: 0.9;
                margin-bottom: 20px;
            }

            .badge-unlock-popup .close-popup {
                background: rgba(255,255,255,0.2);
                border: 2px solid white;
                color: white;
                padding: 10px 20px;
                border-radius: 10px;
                cursor: pointer;
                font-weight: bold;
            }

            .badge-unlock-popup .close-popup:hover {
                background: rgba(255,255,255,0.3);
            }
        </style>
    `;

    // CSS'i ekle
    if (!document.getElementById('badge-visualization-styles')) {
        document.head.insertAdjacentHTML('beforeend', badgeAnimationStyles);
    }

    /**
     * Rozet kazanma popup'ı göster
     * @param {string} badgeId - Rozet ID'si
     * @param {string} badgeTitle - Rozet başlığı
     * @param {string} badgeDesc - Rozet açıklaması
     */
    function showBadgeUnlockPopup(badgeId, badgeTitle, badgeDesc) {
        // Mevcut popup varsa kaldır
        const existingPopup = document.getElementById('badge-unlock-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const visual = badgeVisuals[badgeId] || { emoji: '🏅', color: '#FFD700', glow: '#FFA500' };

        const popup = document.createElement('div');
        popup.id = 'badge-unlock-popup';
        popup.className = 'badge-unlock-popup';
        popup.style.setProperty('--badge-color', visual.color);
        popup.style.setProperty('--badge-glow', visual.glow);

        popup.innerHTML = `
            <div class="badge-icon-large">${visual.emoji}</div>
            <div class="badge-title-large">${badgeTitle}</div>
            <div class="badge-desc-large">${badgeDesc}</div>
            <button class="close-popup" onclick="this.parentElement.remove()">Harika! 🎉</button>
        `;

        document.body.appendChild(popup);

        // Ses çal
        if (typeof playSound === 'function') {
            playSound('success');
        }

        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }

    /**
     * Rozet kartını görselleştir
     * @param {HTMLElement} badgeCard - Rozet kartı elementi
     */
    function visualizeBadgeCard(badgeCard) {
        if (!badgeCard) return;

        const badgeId = badgeCard.id;
        const visual = badgeVisuals[badgeId];

        if (!visual) return;

        // Rozet icon'unu güncelle
        const iconElement = badgeCard.querySelector('.badge-icon');
        if (iconElement) {
            iconElement.textContent = visual.emoji;
            iconElement.style.setProperty('--badge-glow', visual.glow);
        }

        // CSS değişkenlerini ayarla
        badgeCard.style.setProperty('--badge-color', visual.color);
        badgeCard.style.setProperty('--badge-glow', visual.glow);
    }

    /**
     * Tüm rozet kartlarını görselleştir
     */
    function visualizeAllBadges() {
        const badgeCards = document.querySelectorAll('.badge-card');
        badgeCards.forEach(card => {
            visualizeBadgeCard(card);
        });
    }

    /**
     * Rozet kazanma kontrolü (mevcut checkAchievements ile entegre)
     */
    let lastUnlockedBadges = new Set();

    function checkBadgeUnlocks() {
        const badgeCards = document.querySelectorAll('.badge-card');
        const newlyUnlocked = [];

        badgeCards.forEach(card => {
            const badgeId = card.id;
            const statusElement = card.querySelector('.badge-status');
            const isUnlocked = statusElement && 
                !statusElement.textContent.includes('Kilitli') && 
                statusElement.textContent !== '0/' &&
                !statusElement.textContent.match(/^\d+\/\d+$/);

            if (isUnlocked && !lastUnlockedBadges.has(badgeId)) {
                newlyUnlocked.push({
                    id: badgeId,
                    title: card.querySelector('.badge-title')?.textContent || 'Rozet',
                    desc: card.querySelector('.badge-desc')?.textContent || ''
                });
                lastUnlockedBadges.add(badgeId);
            }
        });

        // Yeni kazanılan rozetleri göster
        newlyUnlocked.forEach((badge, index) => {
            setTimeout(() => {
                showBadgeUnlockPopup(badge.id, badge.title, badge.desc);
            }, index * 1000); // Her rozet 1 saniye arayla göster
        });
    }

    // Mevcut checkAchievements fonksiyonunu izle
    const originalCheckAchievements = window.checkAchievements;
    if (originalCheckAchievements) {
        window.checkAchievements = function() {
            const result = originalCheckAchievements.apply(this, arguments);
            setTimeout(() => {
                visualizeAllBadges();
                checkBadgeUnlocks();
            }, 100);
            return result;
        };
    }

    // Sayfa yüklendiğinde
    function initBadgeVisualization() {
        visualizeAllBadges();
        
        // Badges modal açıldığında görselleştir
        const badgesModal = document.getElementById('badgesModal');
        if (badgesModal) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const isVisible = badgesModal.style.display === 'flex' || badgesModal.style.display === 'block';
                        if (isVisible) {
                            setTimeout(visualizeAllBadges, 100);
                        }
                    }
                });
            });

            observer.observe(badgesModal, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBadgeVisualization);
    } else {
        initBadgeVisualization();
    }

    // Global API
    window.showBadgeUnlockPopup = showBadgeUnlockPopup;
    window.visualizeBadgeCard = visualizeBadgeCard;
    window.visualizeAllBadges = visualizeAllBadges;

})();

