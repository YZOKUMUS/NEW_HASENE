@echo off
echo ========================================
echo Hasene Android Kurulumu
echo ========================================
echo.

echo [1/5] Bağımlılıklar yükleniyor...
call npm install
if errorlevel 1 (
    echo HATA: npm install başarısız oldu!
    pause
    exit /b 1
)

echo.
echo [2/5] Proje build ediliyor...
call npm run build
if errorlevel 1 (
    echo HATA: Build başarısız oldu!
    pause
    exit /b 1
)

echo.
echo [3/5] Capacitor Android platformu ekleniyor...
if not exist "android" (
    call npx cap add android
    if errorlevel 1 (
        echo HATA: Android platformu eklenemedi!
        pause
        exit /b 1
    )
)

echo.
echo [4/5] Capacitor sync yapılıyor...
call npx cap sync android
if errorlevel 1 (
    echo HATA: Capacitor sync başarısız oldu!
    pause
    exit /b 1
)

echo.
echo [5/5] Android Studio açılıyor...
call npx cap open android

echo.
echo ========================================
echo Kurulum tamamlandı!
echo ========================================
echo.
echo Sonraki adımlar:
echo 1. Android Studio'da Gradle sync'in tamamlanmasını bekleyin
echo 2. Bir emülatör oluşturun veya fiziksel cihaz bağlayın
echo 3. Run butonuna tıklayarak uygulamayı test edin
echo.
pause



