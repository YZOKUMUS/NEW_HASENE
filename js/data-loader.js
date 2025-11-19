// ============ VERİ YÜKLEME - LAZY LOADING ============
// JSON dosyaları sadece ihtiyaç duyulduğunda yüklenir (performans optimizasyonu)

let kelimeBulData = null;  // kelimebul.json - Kelime Çevir ve Dinle ve Bul için
let ayetOkuData = null;    // ayetoku_formatted.json - Boşluk Doldur ve Ayet Oku için
let duaData = null;        // duaet.json - Dua Et için
let hadisData = null;      // hadisoku.json - Hadis Oku için

// Yükleme durumları (cache kontrolü için)
const dataLoadStatus = {
    kelimeBul: { loaded: false, loading: false },
    ayetOku: { loaded: false, loading: false },
    dua: { loaded: false, loading: false },
    hadis: { loaded: false, loading: false }
};

// ============ NETWORK - FETCH WITH RETRY ============
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    // JSON yükleme hatalarında otomatik retry
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            log.debug(`📡 Fetch attempt ${i + 1}/${retries} failed for ${url}`);
            if (i === retries - 1) {
                // Son deneme de başarısız
                throw new Error(`Failed to load ${url} after ${retries} attempts: ${error.message}`);
            }
            // Retry öncesi bekle (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

// ============ LAZY LOAD FUNCTIONS ============

// Kelime verilerini yükle (Kelime Çevir ve Dinle ve Bul için)
async function loadKelimeData() {
    if (dataLoadStatus.kelimeBul.loaded) {
        return kelimeBulData; // Zaten yüklü, cache'den dön
    }
    
    if (dataLoadStatus.kelimeBul.loading) {
        // Yükleniyor, bekle
        while (dataLoadStatus.kelimeBul.loading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return kelimeBulData;
    }
    
    try {
        dataLoadStatus.kelimeBul.loading = true;
        showLoadingWithProgress('Kelime verileri yükleniyor...', 0);
        kelimeBulData = await fetchWithRetry('kelimebul.json');
        dataLoadStatus.kelimeBul.loaded = true;
        showLoadingWithProgress('Kelime verileri yüklendi!', 100);
        setTimeout(() => hideLoading(), 300);
        return kelimeBulData;
    } catch (error) {
        dataLoadStatus.kelimeBul.loading = false;
        hideLoading();
        log.error('Kelime verileri yükleme hatası:', error);
        showError(error, () => loadKelimeData());
        throw error;
    }
}

// Ayet verilerini yükle (Boşluk Doldur ve Ayet Oku için)
async function loadAyetData() {
    if (dataLoadStatus.ayetOku.loaded) {
        return ayetOkuData; // Zaten yüklü, cache'den dön
    }
    
    if (dataLoadStatus.ayetOku.loading) {
        // Yükleniyor, bekle
        while (dataLoadStatus.ayetOku.loading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return ayetOkuData;
    }
    
    try {
        dataLoadStatus.ayetOku.loading = true;
        showLoadingWithProgress('Ayet verileri yükleniyor...', 0);
        ayetOkuData = await fetchWithRetry('ayetoku_formatted.json');
        dataLoadStatus.ayetOku.loaded = true;
        showLoadingWithProgress('Ayet verileri yüklendi!', 100);
        setTimeout(() => hideLoading(), 300);
        return ayetOkuData;
    } catch (error) {
        dataLoadStatus.ayetOku.loading = false;
        hideLoading();
        log.error('Ayet verileri yükleme hatası:', error);
        showError(error, () => loadAyetData());
        throw error;
    }
}

// Dua verilerini yükle (Dua Et için)
async function loadDuaData() {
    if (dataLoadStatus.dua.loaded) {
        return duaData; // Zaten yüklü, cache'den dön
    }
    
    if (dataLoadStatus.dua.loading) {
        // Yükleniyor, bekle
        while (dataLoadStatus.dua.loading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return duaData;
    }
    
    try {
        dataLoadStatus.dua.loading = true;
        showLoadingWithProgress('Dua verileri yükleniyor...', 0);
        duaData = await fetchWithRetry('duaet.json');
        dataLoadStatus.dua.loaded = true;
        showLoadingWithProgress('Dua verileri yüklendi!', 100);
        setTimeout(() => hideLoading(), 300);
        return duaData;
    } catch (error) {
        dataLoadStatus.dua.loading = false;
        hideLoading();
        log.error('Dua verileri yükleme hatası:', error);
        showError(error, () => loadDuaData());
        throw error;
    }
}

// Hadis verilerini yükle (Hadis Oku için)
async function loadHadisData() {
    if (dataLoadStatus.hadis.loaded) {
        return hadisData; // Zaten yüklü, cache'den dön
    }
    
    if (dataLoadStatus.hadis.loading) {
        // Yükleniyor, bekle
        while (dataLoadStatus.hadis.loading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return hadisData;
    }
    
    try {
        dataLoadStatus.hadis.loading = true;
        showLoadingWithProgress('Hadis verileri yükleniyor...', 0);
        hadisData = await fetchWithRetry('hadisoku.json');
        dataLoadStatus.hadis.loaded = true;
        showLoadingWithProgress('Hadis verileri yüklendi!', 100);
        setTimeout(() => hideLoading(), 300);
        return hadisData;
    } catch (error) {
        dataLoadStatus.hadis.loading = false;
        hideLoading();
        log.error('Hadis verileri yükleme hatası:', error);
        showError(error, () => loadHadisData());
        throw error;
    }
}

// Tüm verileri yükle (başlangıçta gerekirse - opsiyonel)
async function loadAllData() {
    try {
        showLoading('Veriler yükleniyor...');
        await Promise.all([
            loadKelimeData(),
            loadAyetData(),
            loadDuaData(),
            loadHadisData()
        ]);
        hideLoading();
    } catch (error) {
        hideLoading();
        log.error('Veri yükleme hatası:', error);
        throw error;
    }
}

