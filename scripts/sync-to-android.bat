@echo off
echo ========================================
echo Android'e Dosya Senkronizasyonu
echo ========================================
echo.

echo [1/5] Web build yapiliyor...
call npm run build
if errorlevel 1 (
    echo HATA: Build basarisiz oldu!
    pause
    exit /b 1
)

echo.
echo [2/5] JavaScript dosyalari dist'e kopyalaniyor...
if exist "js" (
    if not exist "dist\js" (
        mkdir "dist\js"
    )
    copy /Y "js\*.js" "dist\js\" >nul 2>&1
    echo [OK] JavaScript dosyalari dist'e kopyalandi
) else (
    echo [UYARI] js klasoru bulunamadi
)

echo.
echo [3/5] Data dosyalari dist'e kopyalaniyor...
if exist "data" (
    if not exist "dist\data" (
        mkdir "dist\data"
    )
    xcopy /Y /E /I "data\*" "dist\data\" >nul 2>&1
    echo [OK] Data dosyalari dist'e kopyalandi
) else (
    echo [UYARI] data klasoru bulunamadi
)

echo.
echo [4/5] JavaScript dosyalari Android assets'e kopyalaniyor...
if exist "js" (
    if not exist "android\app\src\main\assets\public\js" (
        mkdir "android\app\src\main\assets\public\js"
    )
    copy /Y "js\*.js" "android\app\src\main\assets\public\js\" >nul 2>&1
    echo [OK] JavaScript dosyalari Android assets'e kopyalandi
) else (
    echo [UYARI] js klasoru bulunamadi
)

echo.
echo [5/5] Capacitor sync yapiliyor...
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

