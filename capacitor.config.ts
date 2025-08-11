import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mausammitra.app',
  appName: 'Mausam Mitra',
  webDir: 'public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Microphone: {
      permissions: ['microphone']
    },
    Geolocation: {
      permissions: ['location']
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#E8F5E8',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#2E7D32'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2E7D32'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;