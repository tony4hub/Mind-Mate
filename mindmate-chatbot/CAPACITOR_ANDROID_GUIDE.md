# 📱 Create Native Android App with Capacitor

## What is Capacitor?
- Wraps your web app in a native Android container
- Access to native features (camera, notifications, etc.)
- Can publish to Google Play Store
- **Same React code**, just packaged differently

## 🚀 Quick Setup (30 minutes)

### Step 1: Install Capacitor
```bash
# In your mindmate-chatbot folder
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

# Initialize Capacitor
npx cap init "MindMate" "com.yourname.mindmate"
```

### Step 2: Build Web App
```bash
npm run build
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Copy Web Assets
```bash
npx cap copy
```

### Step 5: Open in Android Studio
```bash
npx cap open android
```

## 📋 Prerequisites

### Install Android Studio:
1. Download from https://developer.android.com/studio
2. Install with default settings
3. Open Android Studio → More Actions → SDK Manager
4. Install latest Android SDK

### Install Java JDK:
1. Download JDK 11 or higher
2. Set JAVA_HOME environment variable

## 🔧 Configuration

### Update capacitor.config.ts:
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.mindmate',
  appName: 'MindMate',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FAF9F6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#B4D4E1",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "LIGHT_CONTENT",
      backgroundColor: "#B4D4E1"
    }
  }
};

export default config;
```

### Update package.json:
```json
{
  "scripts": {
    "build": "next build && next export",
    "cap:build": "npm run build && npx cap copy",
    "cap:android": "npm run cap:build && npx cap open android"
  }
}
```

## 🎯 Build APK

### In Android Studio:
1. **Build** → **Generate Signed Bundle/APK**
2. Choose **APK**
3. Create new keystore (save it safely!)
4. Build **Release** APK
5. APK will be in `android/app/build/outputs/apk/release/`

### Install APK:
```bash
# Install on connected device
adb install app-release.apk

# Or copy APK to phone and install manually
```

## 📱 Native Features You Can Add

### Push Notifications:
```bash
npm install @capacitor/push-notifications
```

### Camera Access:
```bash
npm install @capacitor/camera
```

### Local Storage:
```bash
npm install @capacitor/storage
```

### Haptic Feedback:
```bash
npm install @capacitor/haptics
```

## 🏪 Publish to Google Play Store

### 1. Prepare Release:
- Create signed APK/AAB
- Test thoroughly on multiple devices
- Create app screenshots
- Write app description

### 2. Google Play Console:
- Go to https://play.google.com/console
- Pay $25 one-time registration fee
- Create new app
- Upload APK/AAB
- Fill out store listing
- Submit for review

### 3. App Store Requirements:
- Privacy policy (required)
- Content rating
- Target audience
- App category: Medical/Health & Fitness

## 🔄 Development Workflow

### Daily Development:
```bash
# Make changes to React code
npm run dev

# Test in browser first
# When ready to test on device:
npm run cap:android
```

### Update App:
```bash
# After making changes
npm run build
npx cap copy
npx cap run android
```

## 🐛 Common Issues

### "Could not find Android SDK":
- Install Android Studio
- Set ANDROID_HOME environment variable

### "Build failed":
- Clean project: Build → Clean Project
- Invalidate caches: File → Invalidate Caches and Restart

### "App crashes on startup":
- Check Android logs: `npx cap run android --livereload`
- Ensure all dependencies are compatible

## 📊 Comparison: PWA vs Native App

| Feature | PWA | Capacitor App |
|---------|-----|---------------|
| **Installation** | Browser | Play Store |
| **App Store** | No | Yes |
| **Offline** | Limited | Full |
| **Native Features** | Limited | Full access |
| **Updates** | Automatic | Manual approval |
| **Size** | Tiny | Larger |
| **Development** | Easier | More complex |

## 🎯 Recommendation:

1. **Start with PWA** (what we just built)
2. **Test with users** for a few weeks
3. **If successful**, create Capacitor app for Play Store
4. **Both can coexist** - PWA for quick access, native app for power users

The PWA gives you 90% of the benefits with 10% of the effort!