@echo off
echo ========================================
echo Android Icon Guncelleme
echo ========================================
echo.

set ICON_SOURCE=assets\images\icon-192-v4-RED-MUSHAF.png

if not exist "%ICON_SOURCE%" (
    echo HATA: Icon dosyasi bulunamadi: %ICON_SOURCE%
    echo Lutfen icon dosyasinin varligini kontrol edin.
    pause
    exit /b 1
)

echo Icon dosyasi bulundu: %ICON_SOURCE%
echo.
echo NOT: Bu script sadece icon dosyalarini kopyalar.
echo Farkli boyutlar icin icon'larinizi resize etmeniz gerekebilir.
echo.
echo Android Studio'da Image Asset Studio kullanmaniz onerilir:
echo 1. android/app/src/main/res klasorune sag tiklayin
echo 2. New ^> Image Asset secin
echo 3. Launcher Icons secin
echo 4. Icon dosyanizi secin
echo 5. Generate butonuna tiklayin
echo.
echo Devam etmek istiyor musunuz? (E/H)
set /p CONTINUE=

if /i not "%CONTINUE%"=="E" (
    echo Iptal edildi.
    pause
    exit /b 0
)

echo.
echo Icon dosyalari kopyalaniyor...

REM xxxhdpi icin (192x192 - mevcut dosya)
if exist "%ICON_SOURCE%" (
    copy /Y "%ICON_SOURCE%" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" >nul 2>&1
    copy /Y "%ICON_SOURCE%" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" >nul 2>&1
    copy /Y "%ICON_SOURCE%" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_foreground.png" >nul 2>&1
    echo [OK] xxxhdpi icon'lar kopyalandi
)

REM Diger boyutlar icin uyari
echo.
echo UYARI: Diger boyutlar (mdpi, hdpi, xhdpi, xxhdpi) icin
echo icon'larinizi resize etmeniz gerekiyor.
echo.
echo Android Studio'da Image Asset Studio kullanarak
echo tum boyutlari otomatik olusturabilirsiniz.
echo.

echo ========================================
echo Icon guncelleme tamamlandi!
echo ========================================
echo.
echo Sonraki adimlar:
echo 1. Android Studio'da Image Asset Studio kullanin
echo 2. VEYA icon'larinizi manuel olarak resize edin
echo 3. Build ^> Rebuild Project yapin
echo 4. Uygulamayi yeniden calistirin
echo.
pause

