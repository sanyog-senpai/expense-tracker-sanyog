
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.27af321d572842ccbe5389aa1ea15419',
  appName: 'spend-sailor-app',
  webDir: 'dist',
  server: {
    url: 'https://27af321d-5728-42cc-be53-89aa1ea15419.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
