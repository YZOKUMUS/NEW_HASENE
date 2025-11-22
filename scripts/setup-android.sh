#!/bin/bash

echo "========================================"
echo "Hasene Android Kurulumu"
echo "========================================"
echo ""

echo "[1/5] Bağımlılıklar yükleniyor..."
npm install
if [ $? -ne 0 ]; then
    echo "HATA: npm install başarısız oldu!"
    exit 1
fi

echo ""
echo "[2/5] Proje build ediliyor..."
npm run build
if [ $? -ne 0 ]; then
    echo "HATA: Build başarısız oldu!"
    exit 1
fi

echo ""
echo "[3/5] Capacitor Android platformu ekleniyor..."
if [ ! -d "android" ]; then
    npx cap add android
    if [ $? -ne 0 ]; then
        echo "HATA: Android platformu eklenemedi!"
        exit 1
    fi
fi

echo ""
echo "[4/5] Capacitor sync yapılıyor..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "HATA: Capacitor sync başarısız oldu!"
    exit 1
fi

echo ""
echo "[5/5] Android Studio açılıyor..."
npx cap open android

echo ""
echo "========================================"
echo "Kurulum tamamlandı!"
echo "========================================"
echo ""
echo "Sonraki adımlar:"
echo "1. Android Studio'da Gradle sync'in tamamlanmasını bekleyin"
echo "2. Bir emülatör oluşturun veya fiziksel cihaz bağlayın"
echo "3. Run butonuna tıklayarak uygulamayı test edin"
echo ""



