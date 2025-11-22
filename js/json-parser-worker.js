// ============ JSON PARSER WEB WORKER ============
// Büyük JSON dosyalarını background'da parse eder (UI donmasını önler)

self.onmessage = function(e) {
    try {
        const { type, data } = e.data;
        
        if (type === 'parse') {
            // JSON string'i parse et
            const startTime = performance.now();
            const parsed = JSON.parse(data);
            const endTime = performance.now();
            
            self.postMessage({
                success: true,
                data: parsed,
                parseTime: endTime - startTime
            });
        } else if (type === 'stringify') {
            // JSON stringify (büyük objeler için)
            const startTime = performance.now();
            const stringified = JSON.stringify(data);
            const endTime = performance.now();
            
            self.postMessage({
                success: true,
                data: stringified,
                stringifyTime: endTime - startTime
            });
        }
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};

