@echo off
REM Otomatik Push Script - NEW_HASENE Project
REM Bu script tüm değişiklikleri GitHub'a push eder

echo ========================================
echo NEW_HASENE - GitHub Push Script
echo ========================================
echo.

REM Remote URL'i kontrol et ve düzelt
echo [1/5] Remote URL kontrol ediliyor...
git remote set-url origin https://github.com/YZOKUMUS/NEW_HASENE.git
git remote -v
echo.

REM Git durumunu kontrol et
echo [2/5] Git durumu kontrol ediliyor...
git status
echo.

REM Tüm değişiklikleri ekle
echo [3/5] Değişiklikler ekleniyor...
git add .
echo.

REM Commit mesajı
set /p commit_msg="Commit mesajı girin (boş bırakılırsa otomatik mesaj kullanılır): "
if "%commit_msg%"=="" (
    set commit_msg=Otomatik commit - %date% %time%
)

REM Commit yap
echo [4/5] Commit yapılıyor...
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo HATA: Commit başarısız! Değişiklik yoksa bu normaldir.
) else (
    echo Commit başarılı!
)
echo.

REM Push yap
echo [5/5] GitHub'a push ediliyor...
git push origin main
if errorlevel 1 (
    echo.
    echo HATA: Push başarısız!
    echo Lütfen manuel olarak kontrol edin: git push origin main
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo BAŞARILI: Tüm değişiklikler GitHub'a push edildi!
    echo ========================================
)
echo.
pause


