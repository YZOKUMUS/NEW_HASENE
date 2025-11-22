// ============ EVENT MANAGER ============
// Event listener'ları ve timer'ları yönetir (memory leak önleme)

class EventManager {
    constructor() {
        this.listeners = [];
        this.timers = [];
        this.intervals = [];
    }
    
    /**
     * Event listener ekle ve kaydet
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element) {
            console.warn('EventManager: Element bulunamadı');
            return;
        }
        
        element.addEventListener(event, handler, options);
        this.listeners.push({ element, event, handler, options });
        return handler;
    }
    
    /**
     * setTimeout ekle ve kaydet
     */
    setTimeout(callback, delay) {
        const timer = setTimeout(() => {
            callback();
            // Timer tamamlandıktan sonra listeden kaldır
            const index = this.timers.indexOf(timer);
            if (index > -1) {
                this.timers.splice(index, 1);
            }
        }, delay);
        this.timers.push(timer);
        return timer;
    }
    
    /**
     * setInterval ekle ve kaydet
     */
    setInterval(callback, delay) {
        const interval = setInterval(callback, delay);
        this.intervals.push(interval);
        return interval;
    }
    
    /**
     * Belirli bir event listener'ı kaldır
     */
    removeEventListener(element, event, handler) {
        if (!element) return;
        
        element.removeEventListener(event, handler);
        this.listeners = this.listeners.filter(
            l => !(l.element === element && l.event === event && l.handler === handler)
        );
    }
    
    /**
     * Belirli bir timer'ı iptal et
     */
    clearTimeout(timer) {
        clearTimeout(timer);
        this.timers = this.timers.filter(t => t !== timer);
    }
    
    /**
     * Belirli bir interval'ı iptal et
     */
    clearInterval(interval) {
        clearInterval(interval);
        this.intervals = this.intervals.filter(i => i !== interval);
    }
    
    /**
     * Tüm event listener'ları ve timer'ları temizle
     */
    cleanup() {
        // Event listener'ları temizle
        this.listeners.forEach(({ element, event, handler, options }) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (e) {
                console.warn('EventManager: Event listener temizleme hatası', e);
            }
        });
        
        // Timer'ları temizle
        this.timers.forEach(timer => {
            try {
                clearTimeout(timer);
            } catch (e) {
                console.warn('EventManager: Timer temizleme hatası', e);
            }
        });
        
        // Interval'ları temizle
        this.intervals.forEach(interval => {
            try {
                clearInterval(interval);
            } catch (e) {
                console.warn('EventManager: Interval temizleme hatası', e);
            }
        });
        
        // Listeleri temizle
        this.listeners = [];
        this.timers = [];
        this.intervals = [];
        
        console.log('✅ EventManager: Tüm listener\'lar ve timer\'lar temizlendi');
    }
    
    /**
     * İstatistikleri göster
     */
    getStats() {
        return {
            listeners: this.listeners.length,
            timers: this.timers.length,
            intervals: this.intervals.length
        };
    }
}

// Global instance
const eventManager = new EventManager();

// Global fonksiyonlar (geriye uyumluluk için)
window.eventManager = eventManager;

