/**
 * Unified Event Handler System
 * Handles both touch and click events for mobile and desktop compatibility
 * Ensures consistent behavior across all devices
 */

class UnifiedEventHandler {
    constructor() {
        this.touchStates = new Map(); // Track touch states per element
        this.scrollThreshold = 10; // Pixels to consider as scroll
        this.tapTimeThreshold = 300; // Milliseconds to consider as tap
    }

    /**
     * Initialize unified event handler for an element
     * @param {HTMLElement} element - Element to attach handlers to
     * @param {Object} options - Configuration options
     * @param {Function} options.onTap - Callback for tap/click
     * @param {Function} options.onScroll - Callback for scroll detection
     * @param {Array} options.ignoreSelectors - Selectors to ignore (e.g., ['.close-btn', '.category-tab'])
     * @param {HTMLElement} options.scrollableContent - Scrollable content element
     */
    init(element, options = {}) {
        if (!element) return;

        const {
            onTap,
            onScroll,
            ignoreSelectors = [],
            scrollableContent = null
        } = options;

        const touchState = {
            startX: 0,
            startY: 0,
            startTime: 0,
            isScrolling: false,
            element: element
        };

        this.touchStates.set(element, touchState);

        // Helper to check if target should be ignored
        const shouldIgnore = (target) => {
            if (!target) return false;
            return ignoreSelectors.some(selector => {
                if (typeof selector === 'string') {
                    return target.matches(selector) || target.closest(selector);
                }
                return false;
            });
        };

        // Helper to check if target is in scrollable content
        const isInScrollableContent = (target) => {
            if (!scrollableContent || !target) return false;
            return target === scrollableContent || target.closest(`#${scrollableContent.id || ''}`);
        };

        // Touch Start
        element.addEventListener('touchstart', (e) => {
            const target = e.target;
            
            // Ignore if target should be ignored
            if (shouldIgnore(target)) {
                return;
            }

            // If in scrollable content, handle separately
            if (isInScrollableContent(target)) {
                touchState.isScrolling = false;
                return;
            }

            const touch = e.touches[0];
            touchState.startX = touch.clientX;
            touchState.startY = touch.clientY;
            touchState.startTime = Date.now();
            touchState.isScrolling = false;
        }, { passive: true });

        // Touch Move
        element.addEventListener('touchmove', (e) => {
            const target = e.target;
            
            // Ignore if target should be ignored
            if (shouldIgnore(target)) {
                return;
            }

            // If in scrollable content, it's definitely scrolling
            if (isInScrollableContent(target)) {
                touchState.isScrolling = true;
                if (onScroll) onScroll(e);
                return;
            }

            // Check if movement exceeds threshold
            if (touchState.startX !== 0 || touchState.startY !== 0) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchState.startX);
                const deltaY = Math.abs(touch.clientY - touchState.startY);
                
                if (deltaX > this.scrollThreshold || deltaY > this.scrollThreshold) {
                    touchState.isScrolling = true;
                    if (onScroll) onScroll(e);
                }
            }
        }, { passive: true });

        // Touch End
        element.addEventListener('touchend', (e) => {
            const target = e.target;
            
            // Ignore if target should be ignored
            if (shouldIgnore(target)) {
                return;
            }

            // If scrolling, don't trigger tap
            if (touchState.isScrolling) {
                touchState.isScrolling = false;
                this.resetTouchState(element);
                return;
            }

            // Check if it's a valid tap
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - touchState.startTime;
            const deltaX = Math.abs(touch.clientX - touchState.startX);
            const deltaY = Math.abs(touch.clientY - touchState.startY);

            if (deltaTime < this.tapTimeThreshold && deltaX < this.scrollThreshold && deltaY < this.scrollThreshold) {
                // Valid tap - trigger callback
                if (onTap) {
                    e.preventDefault();
                    e.stopPropagation();
                    onTap(e, target);
                }
            }

            this.resetTouchState(element);
        }, { passive: false });

        // Click event (for desktop and as fallback)
        element.addEventListener('click', (e) => {
            const target = e.target;
            
            // Ignore if target should be ignored
            if (shouldIgnore(target)) {
                return;
            }

            // If in scrollable content, don't trigger
            if (isInScrollableContent(target)) {
                return;
            }

            // Trigger callback
            if (onTap) {
                onTap(e, target);
            }
        }, true); // Use capture phase
    }

    /**
     * Reset touch state for an element
     */
    resetTouchState(element) {
        const touchState = this.touchStates.get(element);
        if (touchState) {
            touchState.startX = 0;
            touchState.startY = 0;
            touchState.startTime = 0;
            touchState.isScrolling = false;
        }
    }

    /**
     * Initialize category tabs with unified event handling
     * @param {HTMLElement} container - Container with category tabs
     * @param {Function} onCategoryChange - Callback when category changes
     */
    initCategoryTabs(container, onCategoryChange) {
        if (!container) return;

        // Remove existing listeners by cloning
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);

        // Unified handler for category tabs
        const handleCategoryTab = (e, target) => {
            const tab = target.closest('.category-tab');
            if (tab) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const category = tab.getAttribute('data-category');
                if (category && onCategoryChange) {
                    onCategoryChange(category, tab, e);
                }
                return false;
            }
        };

        // Click handler
        newContainer.addEventListener('click', (e) => {
            handleCategoryTab(e, e.target);
        }, true);

        // Touch handler
        newContainer.addEventListener('touchend', (e) => {
            handleCategoryTab(e, e.target);
        }, { passive: false, capture: true });

        return newContainer;
    }

    /**
     * Clean up event handlers
     */
    destroy(element) {
        this.touchStates.delete(element);
    }
}

// Create global instance
window.unifiedEventHandler = new UnifiedEventHandler();



