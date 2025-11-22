// ============================================
// 🎨 Görsel Geri Bildirim Animasyonları
// ============================================
// Bu dosya, doğru/yanlış cevap için animasyonlar ekler
// Mevcut feedback sistemine entegre edilmiştir

(function() {
    'use strict';

    // Animasyon stilleri (CSS)
    const animationStyles = `
        <style id="feedback-animations-styles">
            /* Doğru Cevap Animasyonu */
            @keyframes correctAnswer {
                0% {
                    transform: scale(1);
                    background-color: transparent;
                }
                50% {
                    transform: scale(1.15);
                    background-color: rgba(76, 175, 80, 0.2);
                }
                100% {
                    transform: scale(1);
                    background-color: transparent;
                }
            }

            @keyframes correctPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(76, 175, 80, 0);
                }
            }

            /* Yanlış Cevap Animasyonu */
            @keyframes wrongAnswer {
                0%, 100% {
                    transform: translateX(0);
                }
                10%, 30%, 50%, 70%, 90% {
                    transform: translateX(-10px);
                }
                20%, 40%, 60%, 80% {
                    transform: translateX(10px);
                }
            }

            @keyframes wrongPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(244, 67, 54, 0);
                }
            }

            /* Partikül Efektleri */
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--end-x, 0), var(--end-y, -100px)) scale(0.3) rotate(360deg);
                }
            }

            /* Feedback Element Animasyonları */
            .feedback.correct {
                animation: correctAnswer 0.6s ease-out, correctPulse 0.6s ease-out;
                color: #4CAF50 !important;
                font-weight: 700;
            }

            .feedback.wrong {
                animation: wrongAnswer 0.5s ease-out, wrongPulse 0.5s ease-out;
                color: #f44336 !important;
                font-weight: 700;
            }

            /* Partikül Container */
            .particle-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }

            .particle {
                position: absolute;
                font-size: 24px;
                pointer-events: none;
                animation: particleFloat 1s ease-out forwards;
            }
        </style>
    `;

    // CSS'i ekle
    if (!document.getElementById('feedback-animations-styles')) {
        document.head.insertAdjacentHTML('beforeend', animationStyles);
    }

    /**
     * Partikül efekti oluştur
     * @param {HTMLElement} element - Partiküllerin başlayacağı element
     * @param {string} type - 'correct' veya 'wrong'
     */
    function createParticles(element, type) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Partikül container oluştur veya bul
        let container = document.getElementById('particle-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'particle-container';
            container.className = 'particle-container';
            document.body.appendChild(container);
        }

        const particles = type === 'correct' 
            ? ['⭐', '✨', '🎉', '💫', '🌟']
            : ['💥', '❌', '⚠️'];

        particles.forEach((emoji, index) => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = emoji;
            particle.style.position = 'absolute';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.fontSize = '24px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            // Rastgele yön ve hız
            const angle = (Math.PI * 2 * index) / particles.length + (Math.random() - 0.5) * 0.5;
            const distance = 80 + Math.random() * 40;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance - 50;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            particle.style.animation = `particleFloat 1s ease-out forwards`;
            particle.style.animationDelay = (index * 0.1) + 's';
            
            container.appendChild(particle);

            // Animasyon bitince kaldır
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1100);
        });
    }

    /**
     * Doğru cevap animasyonu
     * @param {HTMLElement} feedbackElement - Feedback elementi
     */
    function animateCorrectAnswer(feedbackElement) {
        if (!feedbackElement) return;

        // Partikül efekti
        createParticles(feedbackElement, 'correct');

        // Haptic feedback (mobil cihazlarda)
        if (typeof hapticFeedback === 'function') {
            hapticFeedback('success');
        }

        // Buton animasyonu (eğer varsa)
        const clickedButton = document.querySelector('.option-btn.clicked, .flutter-btn.clicked');
        if (clickedButton) {
            clickedButton.style.animation = 'correctAnswer 0.6s ease-out';
            setTimeout(() => {
                clickedButton.style.animation = '';
            }, 600);
        }
    }

    /**
     * Yanlış cevap animasyonu
     * @param {HTMLElement} feedbackElement - Feedback elementi
     */
    function animateWrongAnswer(feedbackElement) {
        if (!feedbackElement) return;

        // Partikül efekti
        createParticles(feedbackElement, 'wrong');

        // Haptic feedback (mobil cihazlarda)
        if (typeof hapticFeedback === 'function') {
            hapticFeedback('error');
        }

        // Buton animasyonu (eğer varsa)
        const clickedButton = document.querySelector('.option-btn.clicked, .flutter-btn.clicked');
        if (clickedButton) {
            clickedButton.style.animation = 'wrongAnswer 0.5s ease-out';
            setTimeout(() => {
                clickedButton.style.animation = '';
            }, 500);
        }
    }

    /**
     * Feedback element'ini izle ve animasyon ekle
     * @param {HTMLElement} feedbackElement - Feedback elementi
     */
    function watchFeedbackElement(feedbackElement) {
        if (!feedbackElement) return;

        // MutationObserver ile class değişikliklerini izle
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    if (element.classList.contains('correct')) {
                        animateCorrectAnswer(element);
                    } else if (element.classList.contains('wrong')) {
                        animateWrongAnswer(element);
                    }
                }
            });
        });

        observer.observe(feedbackElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Tüm feedback elementlerini bul ve izle
    function initFeedbackAnimations() {
        const feedbackElements = [
            document.getElementById('feedback'),
            document.getElementById('dinleFeedback'),
            document.getElementById('boslukFeedback')
        ];

        feedbackElements.forEach(element => {
            if (element) {
                watchFeedbackElement(element);
            }
        });
    }

    // Sayfa yüklendiğinde başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeedbackAnimations);
    } else {
        initFeedbackAnimations();
    }

    // Global fonksiyonlar (mevcut kodla uyumluluk için)
    window.animateCorrectAnswer = animateCorrectAnswer;
    window.animateWrongAnswer = animateWrongAnswer;

})();

