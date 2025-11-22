@echo off
echo ========================================
echo Android'e Dosya Senkronizasyonu
echo ========================================
echo.

echo [1/4] Web build yapiliyor...
call npm run build
if errorlevel 1 (
    echo HATA: Build basarisiz oldu!
    pause
    exit /b 1
)

echo.
echo [2/4] JavaScript dosyalari kopyalaniyor...
if exist "js" (
    if not exist "android\app\src\main\assets\public\js" (
        mkdir "android\app\src\main\assets\public\js"
    )
    copy /Y "js\*.js" "android\app\src\main\assets\public\js\" >nul 2>&1
    echo [OK] JavaScript dosyalari kopyalandi
) else (
    echo [UYARI] js klasoru bulunamadi
)

echo.
echo [3/4] Data dosyalari kopyalaniyor...
if exist "data" (
    if not exist "android\app\src\main\assets\public\data" (
        mkdir "android\app\src\main\assets\public\data"
    )
    xcopy /Y /E /I "data\*" "android\app\src\main\assets\public\data\" >nul 2>&1
    echo [OK] Data dosyalari kopyalandi
) else (
    echo [UYARI] data klasoru bulunamadi
)

echo.
echo [4/4] Capacitor sync yapiliyor...
call npx cap sync android
if errorlevel 1 (
    echo HATA: Capacitor sync basarisiz oldu!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Senkronizasyon tamamlandi!
echo ========================================
echo.
echo Android Studio'da RUN butonuna tiklayin.
echo.
pause

