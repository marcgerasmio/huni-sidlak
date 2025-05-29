import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hunisidlak.app',
  appName: 'Huni - Sidlak',
  webDir: 'dist',
  server: {
    hostname: 'localhost',
    cleartext: false,
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
};

export default config;
