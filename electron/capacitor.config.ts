import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.birthdaybuddy.app',
  appName: 'Birthday Buddy',
  webDir: 'dist', // Vite builds to here
  server: {
    androidScheme: 'https'
  },
  electron: {
    // This matches the error 'capacitor-electron://'
    customUrlScheme: 'birthday-buddy', 
    splashScreenEnabled: false
  }
};

export default config;