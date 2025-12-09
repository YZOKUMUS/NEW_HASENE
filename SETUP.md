# Hasene Backend Kurulum Rehberi

Bu rehber, Hasene Arapça Dersi uygulamasını backend ile çalıştırmak için adım adım talimatlar içerir.

## Hızlı Başlangıç

### 1. Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# .env dosyasını düzenleyin ve gerekli bilgileri girin
nano .env  # veya notepad .env (Windows)
```

### 2. MongoDB Kurulumu

#### Seçenek A: MongoDB Atlas (Önerilen - Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Ücretsiz cluster oluşturun (M0 - Free tier)
3. Database Access'te kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'lere izin verir)
5. "Connect" > "Connect your application" > Connection string'i kopyalayın
6. `.env` dosyasına ekleyin:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hasene_db
   ```

#### Seçenek B: Yerel MongoDB

1. [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin ve yükleyin
2. MongoDB'yi başlatın
3. `.env` dosyasına ekleyin:
   ```
   MONGODB_URI=mongodb://localhost:27017/hasene_db
   ```

### 3. Google OAuth Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" gidin
4. "Create Credentials" > "OAuth client ID" seçin
5. Application type: "Web application"
6. Authorized redirect URIs ekleyin:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://your-backend-url.com/auth/google/callback`
7. Client ID ve Client Secret'ı kopyalayın
8. `.env` dosyasına ekleyin:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
   ```

### 4. JWT Secret Oluşturma

Güçlü bir JWT secret oluşturun:

```bash
# Node.js ile random string oluşturun
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`.env` dosyasına ekleyin:
```
JWT_SECRET=your-generated-secret-here
```

### 5. Frontend URL Ayarlama

`.env` dosyasında frontend URL'inizi ayarlayın:

```
FRONTEND_URL=http://localhost:5500
```

Eğer VS Code Live Server kullanıyorsanız, port numarasını kontrol edin.

### 6. Backend'i Başlatma

```bash
# Development mode (otomatik yeniden başlatma)
npm run dev

# Production mode
npm start
```

Backend `http://localhost:3000` adresinde çalışacak.

### 7. Frontend'i Güncelleme

`js/api-client.js` dosyasında backend URL'ini kontrol edin:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
};
```

### 8. Test Etme

1. Backend health check:
   ```bash
   curl http://localhost:3000/api/health
   ```
   Veya browser'da: `http://localhost:3000/api/health`

2. Frontend'i açın ve "Giriş Yap" butonuna tıklayın
3. Google ile giriş yapın
4. Redirect sonrası token'ın kaydedildiğini kontrol edin

## .env Dosyası Örneği

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hasene_db

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5500
```

## Sorun Giderme

### MongoDB Bağlantı Hatası

```
Error: connect ECONNREFUSED
```

**Çözüm:**
- MongoDB'nin çalıştığından emin olun
- Connection string'i kontrol edin
- MongoDB Atlas kullanıyorsanız, IP whitelist'i kontrol edin

### Google OAuth Hatası

```
Error: redirect_uri_mismatch
```

**Çözüm:**
- Google Cloud Console'da redirect URI'nin doğru olduğundan emin olun
- OAuth consent screen'in yapılandırıldığından emin olun

### CORS Hatası

```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:5500' has been blocked by CORS policy
```

**Çözüm:**
- `.env` dosyasında `FRONTEND_URL`'in doğru olduğundan emin olun
- Backend'i yeniden başlatın

### Token Hatası

```
Error: Invalid token
```

**Çözüm:**
- Browser console'da token'ın kaydedildiğini kontrol edin
- Token'ın süresinin dolmadığından emin olun (30 gün)
- JWT_SECRET'ın doğru olduğundan emin olun

## Sonraki Adımlar

1. ✅ Backend çalışıyor mu kontrol edin
2. ✅ Frontend'den API çağrıları yapılıyor mu test edin
3. ✅ Google OAuth çalışıyor mu test edin
4. ✅ Veriler database'e kaydediliyor mu kontrol edin
5. 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasını okuyun ve production'a deploy edin

## Yardım

Sorun yaşıyorsanız:
1. Backend loglarını kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ında API isteklerini kontrol edin
4. MongoDB Atlas dashboard'unu kontrol edin

## Güvenlik Notları

- ⚠️ `.env` dosyasını asla commit etmeyin (`.gitignore`'da zaten var)
- ⚠️ Production'da güçlü bir JWT_SECRET kullanın
- ⚠️ MongoDB credentials'larınızı paylaşmayın
- ⚠️ Google OAuth credentials'larınızı paylaşmayın
- ⚠️ Production'da HTTPS kullanın

