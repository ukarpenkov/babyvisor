import { ExpoConfig } from 'expo/config'

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

export default (): ExpoConfig => ({
    name: 'babyvisor',
    owner: 'yurijs',
    slug: 'BabyVisor', // Updated slug to match the project
    version: '2.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'babyvisor',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
    },
    android: {
        package: 'com.yurijs.babyvisor', // Add your unique application ID here
        versionCode: 3,
        permissions: ['android.permission.CAMERA'],
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        edgeToEdgeEnabled: true,
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    extra: {
        eas: {
            projectId: '77fdde13-76f7-4077-a49e-c4b153eca4f4',
        },
    },
    plugins: [
        './plugins/with-adi-registration.js',
        'expo-router',
        [
            'expo-camera',
            {
                cameraPermission:
                    'Allow $(PRODUCT_NAME) to access your camera to show the world through a baby\'s eyes.',
                microphonePermission: false,
                recordAudioAndroid: false,
            },
        ],
        './plugins/with-camera-preview-fix.js',
        [
            'expo-splash-screen',
            {
                image: './assets/images/splash-icon.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        [
            'expo-media-library',
            {
                photosPermission:
                    'Allow $(PRODUCT_NAME) to access your photos.',
                savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
                isAccessMediaLocationEnabled: true,
            },
        ],
        [
            'expo-image-picker',
            {
                photosPermission:
                    'The app accesses your photos to let you edit them.',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
})
