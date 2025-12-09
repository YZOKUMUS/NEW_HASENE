# Hasene Backend API

Hasene Arapça Dersi uygulaması için Node.js + Express backend API.

## Özellikler

- ✅ Google OAuth Authentication
- ✅ MongoDB veritabanı
- ✅ RESTful API endpoints
- ✅ JWT token authentication
- ✅ Kullanıcı bazlı veri saklama
- ✅ Offline fallback desteği

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2. Environment Variables Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hasene_db

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5500
```

### 3. MongoDB Kurulumu

#### Yerel MongoDB:

```bash
# MongoDB'yi yükleyin ve başlatın
# Windows: MongoDB Community Server'ı indirin ve yükleyin
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

#### MongoDB Atlas (Cloud):

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Cluster oluşturun
3. Database Access'te kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'lere izin verir)
5. Connection string'i alın ve `.env` dosyasına ekleyin

### 4. Google OAuth Ayarları

1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" gidin
4. "Create Credentials" > "OAuth client ID" seçin
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/auth/google/callback` (development)
7. Client ID ve Client Secret'ı `.env` dosyasına ekleyin

### 5. Sunucuyu Başlat

```bash
# Development mode (nodemon ile otomatik yeniden başlatma)
npm run dev

# Production mode
npm start
```

Sunucu `http://localhost:3000` adresinde çalışacak.

## API Endpoints

### Authentication

- `GET /api/auth/google` - Google ile giriş yap
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Mevcut kullanıcı bilgilerini al
- `POST /api/auth/logout` - Çıkış yap

### Stats

- `GET /api/stats` - Kullanıcı istatistiklerini al
- `PUT /api/stats` - Kullanıcı istatistiklerini güncelle
- `PATCH /api/stats/:field` - Belirli bir stat alanını güncelle

### Favorites

- `GET /api/favorites` - Favori kelimeleri al
- `POST /api/favorites/:wordId` - Favori kelime ekle
- `DELETE /api/favorites/:wordId` - Favori kelime çıkar
- `POST /api/favorites/toggle/:wordId` - Favori kelime toggle

### Health Check

- `GET /api/health` - Sunucu durumu

## Veritabanı Şeması

### Users Collection

```javascript
{
  _id: ObjectId,
  googleId: String,
  email: String (unique),
  name: String,
  picture: String,
  createdAt: Date,
  lastLogin: Date
}
```

### UserStats Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  totalPoints: Number,
  badges: {
    stars: Number,
    bronze: Number,
    silver: Number,
    gold: Number,
    diamond: Number
  },
  streakData: {
    currentStreak: Number,
    longestStreak: Number,
    lastPlayDate: Date,
    streakHistory: Array
  },
  dailyTasks: Object,
  weeklyTasks: Object,
  wordStats: Map,
  unlockedAchievements: Array,
  unlockedBadges: Array,
  perfectLessonsCount: Number,
  gameStats: Object,
  favoriteWords: Array,
  dailyGoalHasene: Number,
  dailyGoalLevel: String,
  dailyCorrect: Number,
  dailyWrong: Number,
  dailyXP: Number,
  lastDailyGoalDate: Date,
  onboardingSeen: Boolean,
  lastUpdated: Date
}
```

## Frontend Entegrasyonu

Frontend'de `js/api-client.js` dosyası API ile iletişim kurar. Backend URL'ini değiştirmek için:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Development
  // Production'da: 'https://your-domain.com/api'
};
```

## Deployment

### Heroku

1. Heroku CLI'yı yükleyin
2. Heroku'da yeni app oluşturun
3. MongoDB Atlas bağlantısını ekleyin
4. Environment variables'ı ayarlayın
5. Deploy edin:

```bash
heroku login
heroku git:remote -a your-app-name
git push heroku main
```

### Railway

1. [Railway](https://railway.app/) hesabı oluşturun
2. Yeni proje oluşturun
3. GitHub repo'yu bağlayın
4. MongoDB servisi ekleyin
5. Environment variables'ı ayarlayın
6. Deploy otomatik olarak başlar

### Render

1. [Render](https://render.com/) hesabı oluşturun
2. Yeni Web Service oluşturun
3. GitHub repo'yu bağlayın
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment variables'ı ayarlayın
7. MongoDB servisi ekleyin

### DigitalOcean App Platform

1. DigitalOcean hesabı oluşturun
2. App Platform'da yeni app oluşturun
3. GitHub repo'yu bağlayın
4. MongoDB database ekleyin
5. Environment variables'ı ayarlayın
6. Deploy edin

## Güvenlik Notları

- Production'da mutlaka güçlü bir `JWT_SECRET` kullanın
- MongoDB bağlantı string'inizi güvende tutun
- Google OAuth credentials'larınızı paylaşmayın
- CORS ayarlarını production için sınırlandırın
- HTTPS kullanın (production)

## Sorun Giderme

### MongoDB bağlantı hatası

- MongoDB'nin çalıştığından emin olun
- Connection string'i kontrol edin
- Firewall ayarlarını kontrol edin (Atlas için)

### Google OAuth hatası

- Redirect URI'nin doğru olduğundan emin olun
- Client ID ve Secret'ı kontrol edin
- Google Cloud Console'da OAuth consent screen'i ayarlayın

### CORS hatası

- Frontend URL'inin `.env` dosyasında doğru olduğundan emin olun
- Backend'de CORS middleware'inin aktif olduğundan emin olun

## Lisans

Bu proje eğitim amaçlıdır.

