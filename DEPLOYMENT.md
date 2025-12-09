# Hasene Deployment Rehberi

Bu doküman, Hasene Arapça Dersi uygulamasını deploy etmek için adım adım rehberdir.

## Genel Bakış

Uygulama iki ana bileşenden oluşur:
1. **Frontend**: Static HTML/CSS/JS dosyaları
2. **Backend**: Node.js + Express API

## Deployment Seçenekleri

### 1. Heroku (Önerilen - Kolay)

#### Backend Deployment

```bash
# Heroku CLI'yı yükleyin
# https://devcenter.heroku.com/articles/heroku-cli

# Heroku'da giriş yapın
heroku login

# Backend klasöründe
cd backend

# Heroku app oluşturun
heroku create hasene-backend

# MongoDB Atlas bağlantısı ekleyin (ücretsiz tier mevcut)
# Heroku dashboard'dan "Resources" > "MongoDB Atlas" ekleyin
# Veya manuel olarak:
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/hasene_db"

# Environment variables ekleyin
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-super-secret-key-here"
heroku config:set GOOGLE_CLIENT_ID="your-google-client-id"
heroku config:set GOOGLE_CLIENT_SECRET="your-google-client-secret"
heroku config:set GOOGLE_CALLBACK_URL="https://hasene-backend.herokuapp.com/auth/google/callback"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"

# Deploy edin
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a hasene-backend
git push heroku main
```

#### Frontend Deployment

1. **Netlify** (Önerilen):
   - [Netlify](https://www.netlify.com/) hesabı oluşturun
   - "New site from Git" seçin
   - GitHub repo'nuzu bağlayın
   - Build settings:
     - Build command: (boş bırakın)
     - Publish directory: `/` (root)
   - Environment variables:
     - `VITE_API_URL` = `https://hasene-backend.herokuapp.com/api` (eğer Vite kullanıyorsanız)
   - `js/api-client.js` dosyasında `API_CONFIG.BASE_URL`'i güncelleyin

2. **Vercel**:
   - [Vercel](https://vercel.com/) hesabı oluşturun
   - GitHub repo'nuzu import edin
   - Framework Preset: "Other"
   - Root Directory: `/`
   - Deploy edin

3. **GitHub Pages**:
   ```bash
   # GitHub Actions ile otomatik deploy
   # .github/workflows/deploy.yml dosyası oluşturun
   ```

### 2. Railway (Kolay ve Modern)

#### Backend

1. [Railway](https://railway.app/) hesabı oluşturun
2. "New Project" > "Deploy from GitHub repo"
3. Repo'nuzu seçin
4. Root Directory: `backend`
5. Environment variables ekleyin:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`
   - `FRONTEND_URL`
6. MongoDB servisi ekleyin (Railway'de MongoDB addon var)
7. Deploy otomatik başlar

#### Frontend

1. Railway'de yeni service oluşturun
2. "Deploy from GitHub repo"
3. Root Directory: `/` (root)
4. Build Command: (boş)
5. Start Command: (boş - static site)
6. Environment variables:
   - `API_URL` = Backend URL'iniz

### 3. Render (Ücretsiz Tier)

#### Backend

1. [Render](https://render.com/) hesabı oluşturun
2. "New Web Service"
3. GitHub repo'nuzu bağlayın
4. Settings:
   - Name: `hasene-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`
5. Environment variables ekleyin
6. MongoDB servisi ekleyin (Render'da MongoDB addon var)

#### Frontend

1. Render'da "New Static Site"
2. GitHub repo'nuzu bağlayın
3. Build Command: (boş)
4. Publish Directory: `/`
5. Environment variables:
   - `API_URL` = Backend URL'iniz

### 4. DigitalOcean App Platform

#### Backend

1. DigitalOcean hesabı oluşturun
2. App Platform'da "Create App"
3. GitHub repo'nuzu bağlayın
4. Component ayarları:
   - Type: Web Service
   - Source Directory: `backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Database ekleyin (MongoDB)
6. Environment variables ekleyin

#### Frontend

1. Aynı app'te yeni component ekleyin
2. Type: Static Site
3. Source Directory: `/` (root)
4. Build Command: (boş)
5. Output Directory: `/`

### 5. VPS (Ubuntu/Debian) - Manuel Kurulum

#### Backend Kurulumu

```bash
# Sunucuya SSH ile bağlanın
ssh user@your-server-ip

# Node.js yükleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB yükleyin
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# PM2 yükleyin (process manager)
sudo npm install -g pm2

# Projeyi klonlayın
git clone https://github.com/your-username/hasene.git
cd hasene/backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
nano .env
# Environment variables'ı ekleyin

# PM2 ile başlatın
pm2 start server.js --name hasene-backend
pm2 save
pm2 startup

# Nginx reverse proxy kurulumu
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/hasene-backend

# Nginx config:
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/hasene-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL sertifikası (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Kurulumu

```bash
# Nginx static site config
sudo nano /etc/nginx/sites-available/hasene-frontend

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/hasene;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

sudo ln -s /etc/nginx/sites-available/hasene-frontend /etc/nginx/sites-enabled/
sudo mkdir -p /var/www/hasene
sudo cp -r /path/to/hasene/* /var/www/hasene/
sudo chown -R www-data:www-data /var/www/hasene
sudo nginx -t
sudo systemctl restart nginx

# SSL
sudo certbot --nginx -d yourdomain.com
```

## Google OAuth Production Ayarları

1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. OAuth consent screen'i production için yayınlayın
3. Authorized redirect URIs'e production URL'inizi ekleyin:
   - `https://your-backend-url.com/auth/google/callback`
4. Authorized JavaScript origins:
   - `https://your-backend-url.com`
   - `https://your-frontend-url.com`

## Frontend API URL Güncelleme

Deploy sonrası `js/api-client.js` dosyasını güncelleyin:

```javascript
const API_CONFIG = {
  BASE_URL: 'https://your-backend-url.com/api', // Production URL
};
```

Veya environment variable kullanın (build-time):

```javascript
const API_CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3000/api',
};
```

## MongoDB Atlas Kurulumu (Cloud)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Free tier (M0) cluster oluşturun
3. Database Access'te kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'lere izin verir)
5. "Connect" > "Connect your application" > Connection string'i kopyalayın
6. Connection string'i `.env` dosyasına ekleyin:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hasene_db?retryWrites=true&w=majority
   ```

## Test Etme

1. Backend health check:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. Frontend'den API çağrısı:
   - Browser console'da: `fetch('https://your-backend-url.com/api/health')`

3. Google OAuth test:
   - Frontend'de "Giriş Yap" butonuna tıklayın
   - Google ile giriş yapın
   - Redirect'in doğru çalıştığını kontrol edin

## Sorun Giderme

### CORS Hatası

Backend'de CORS ayarlarını kontrol edin:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
```

### MongoDB Bağlantı Hatası

- Connection string'i kontrol edin
- MongoDB Atlas'ta IP whitelist'i kontrol edin
- Network access ayarlarını kontrol edin

### Google OAuth Redirect Hatası

- Redirect URI'nin Google Cloud Console'da kayıtlı olduğundan emin olun
- OAuth consent screen'in production için yayınlandığından emin olun

## Önerilen Deployment Kombinasyonu

**En Kolay ve Ücretsiz:**
- Backend: Railway veya Render (ücretsiz tier)
- Frontend: Netlify veya Vercel (ücretsiz tier)
- Database: MongoDB Atlas (ücretsiz tier)

**En Performanslı:**
- Backend: DigitalOcean App Platform
- Frontend: Cloudflare Pages
- Database: MongoDB Atlas

**En Esnek:**
- Backend: VPS (DigitalOcean Droplet)
- Frontend: Cloudflare Pages
- Database: MongoDB Atlas veya VPS'te MongoDB

## Maliyet Tahmini

**Ücretsiz Tier:**
- Railway/Render: Ücretsiz (sınırlı)
- Netlify/Vercel: Ücretsiz
- MongoDB Atlas: Ücretsiz (512MB storage)
- **Toplam: $0/ay**

**Küçük Ölçekli:**
- Railway: $5/ay
- Netlify Pro: $19/ay (opsiyonel)
- MongoDB Atlas M0: Ücretsiz
- **Toplam: ~$5-24/ay**

## Sonuç

En kolay başlangıç için:
1. Backend'i Railway'e deploy edin
2. Frontend'i Netlify'a deploy edin
3. MongoDB Atlas kullanın
4. Google OAuth'u production için yapılandırın

Herhangi bir sorunla karşılaşırsanız, backend ve frontend loglarını kontrol edin.

