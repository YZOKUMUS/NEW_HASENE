/**
 * Progressive enhancement loader for non-critical bundles.
 * Keeps the initial render lightweight by pushing optional scripts
 * to idle periods while still initializing key UX helpers quickly.
 */
(function initLazyLoader() {
    const INTERACTIVE_SCRIPTS = [
        {
            src: 'js/favorites.js',
            onLoad: () => typeof loadFavorites === 'function' && loadFavorites()
        },
        { src: 'js/feedback-animations.js' },
        { src: 'js/sound-effects.js' }
    ];

    const BACKGROUND_SCRIPTS = [
        { src: 'js/badge-visualization.js' },
        { src: 'js/game-tutorial.js' },
        { src: 'js/notifications.js' },
        { src: 'js/leaderboard.js' },
        { src: 'js/social-share.js' },
        { src: 'js/detailed-stats.js' }
    ];

    const scheduledScripts = new Set();

    /**
     * Dynamically append a script tag and resolve when it loads.
     * @param {{src: string, onLoad?: Function}} entry
     * @returns {Promise<void>}
     */
    function loadScript(entry) {
        if (!entry || !entry.src) {
            return Promise.resolve();
        }

        if (scheduledScripts.has(entry.src)) {
            // Already scheduled/loaded
            if (typeof entry.onLoad === 'function') {
                try {
                    entry.onLoad();
                } catch (error) {
                    console.error(`[lazy-loader] Post-load hook failed for ${entry.src}`, error);
                }
            }
            return Promise.resolve();
        }

        scheduledScripts.add(entry.src);

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = entry.src;
            script.async = true;
            script.dataset.lazyLoaded = entry.src;

            script.onload = () => {
                if (typeof entry.onLoad === 'function') {
                    try {
                        entry.onLoad();
                    } catch (error) {
                        console.error(`[lazy-loader] Post-load hook failed for ${entry.src}`, error);
                    }
                }
                resolve();
            };

            script.onerror = (event) => {
                console.error(`[lazy-loader] Failed to load ${entry.src}`, event);
                reject(new Error(`Failed to load ${entry.src}`));
            };

            document.head.appendChild(script);
        });
    }

    function loadInteractiveScripts() {
        const perfAvailable = typeof performance !== 'undefined' && typeof performance.now === 'function';
        const start = perfAvailable ? performance.now() : Date.now();
        return Promise.all(INTERACTIVE_SCRIPTS.map(loadScript)).finally(() => {
            const end = perfAvailable ? performance.now() : Date.now();
            const duration = end - start;
            if (perfAvailable && typeof performance.mark === 'function') {
                performance.mark('interactive-scripts-loaded');
            }
            if (typeof log !== 'undefined' && typeof log.debug === 'function') {
                log.debug(`⚙️ İnteraktif yardımcılar ${Math.round(duration)}ms içinde yüklendi`);
            }
        });
    }

    function loadBackgroundScripts() {
        const queue = [...BACKGROUND_SCRIPTS];
        const idle =
            window.requestIdleCallback ||
            function (cb) {
                return window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 1);
            };

        function processQueue() {
            if (!queue.length) return;
            const entry = queue.shift();
            loadScript(entry)
                .catch(() => {
                    // Already logged inside loadScript
                })
                .finally(() => idle(processQueue));
        }

        idle(processQueue);
    }

    function startLazyLoading() {
        loadInteractiveScripts().finally(() => {
            window.addEventListener('load', () => loadBackgroundScripts(), { once: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startLazyLoading, { once: true });
    } else {
        startLazyLoading();
    }
})();
