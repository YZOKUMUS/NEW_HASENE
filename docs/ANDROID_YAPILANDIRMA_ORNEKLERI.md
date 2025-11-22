# Android Yapılandırma Örnekleri

Bu dosya, Android uygulaması için gerekli yapılandırma dosyalarının örneklerini içerir. Capacitor sync yaptıktan sonra bu dosyalar `android/app/src/main/` klasöründe oluşturulacaktır.

## AndroidManifest.xml Örneği

`android/app/src/main/AndroidManifest.xml` dosyası şu şekilde olmalıdır:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hasene.arapca">

    <!-- İzinler -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Özellikler -->
    <uses-feature android:name="android.hardware.microphone" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:networkSecurityConfig="@xml/network_security_config">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <!-- Capacitor Bridge -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
```

## Network Security Config

`android/app/src/main/res/xml/network_security_config.xml` dosyası oluşturun:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Production için HTTPS zorunlu -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    
    <!-- Development için HTTP'ye izin ver (isteğe bağlı) -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
    
    <!-- Dış API'ler için -->
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">audios.quranwbw.com</domain>
        <domain includeSubdomains="true">tanzil.net</domain>
        <domain includeSubdomains="true">everyayah.com</domain>
    </domain-config>
</network-security-config>
```

## build.gradle (app) Örneği

`android/app/build.gradle` dosyasının önemli kısımları:

```gradle
android {
    namespace "com.hasene.arapca"
    compileSdk 34

    defaultConfig {
        applicationId "com.hasene.arapca"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }

    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
}
```

## gradle.properties

`android/gradle.properties` dosyasına ekleyin (keystore bilgileri için):

```properties
# Keystore bilgileri (güvenlik için .gitignore'a ekleyin!)
MYAPP_RELEASE_STORE_FILE=hasene-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=hasene
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

**ÖNEMLİ:** Bu dosyayı `.gitignore`'a ekleyin!

## ProGuard Rules

`android/app/proguard-rules.pro` dosyasına ekleyin:

```proguard
# Capacitor
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Uygulama sınıfları
-keep class com.hasene.arapca.** { *; }

# WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Gson (eğer kullanıyorsanız)
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
```

## Strings.xml

`android/app/src/main/res/values/strings.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Hasene Arapça Dersi</string>
    <string name="title_activity_main">Hasene Arapça Dersi</string>
</resources>
```

## Splash Screen

Splash screen için `android/app/src/main/res/drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/ic_launcher"/>
    </item>
</layer-list>
```

## Colors.xml

`android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#667eea</color>
    <color name="colorPrimaryDark">#764ba2</color>
    <color name="colorAccent">#764ba2</color>
    <color name="splash_background">#667eea</color>
</resources>
```

## Hızlı Kurulum Script'i

Windows için `scripts/setup-android.bat`:

```batch
@echo off
echo Hasene Android Kurulumu Başlatılıyor...

echo.
echo [1/5] Bağımlılıklar yükleniyor...
call npm install

echo.
echo [2/5] Proje build ediliyor...
call npm run build

echo.
echo [3/5] Capacitor sync yapılıyor...
call npx cap sync android

echo.
echo [4/5] Android Studio açılıyor...
call npx cap open android

echo.
echo Kurulum tamamlandı!
echo Android Studio'da projeyi açıp test edebilirsiniz.
pause
```

Linux/Mac için `scripts/setup-android.sh`:

```bash
#!/bin/bash

echo "Hasene Android Kurulumu Başlatılıyor..."

echo ""
echo "[1/5] Bağımlılıklar yükleniyor..."
npm install

echo ""
echo "[2/5] Proje build ediliyor..."
npm run build

echo ""
echo "[3/5] Capacitor sync yapılıyor..."
npx cap sync android

echo ""
echo "[4/5] Android Studio açılıyor..."
npx cap open android

echo ""
echo "Kurulum tamamlandı!"
echo "Android Studio'da projeyi açıp test edebilirsiniz."
```

## Notlar

- Bu dosyalar Capacitor sync yaptıktan sonra otomatik oluşturulur
- Manuel değişiklik yapmanız gerekirse, `npx cap sync` yaptıktan sonra yapın
- Keystore bilgilerinizi asla Git'e commit etmeyin!



