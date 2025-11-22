const config = {
  appId: 'com.hasene.arapca',
  appName: 'Hasene Arapça Dersi',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Development için localhost kullanmak isterseniz:
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#667eea',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#667eea',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Production'da false olmalı
  },
};

module.exports = config;



