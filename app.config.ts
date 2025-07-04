import { ExpoConfig } from 'expo/config'

// In SDK 46 and lower, use the following import instead:
// import { ExpoConfig } from '@expo/config-types';

export default (): ExpoConfig => ({
    name: 'babyvisor',
    owner: 'yurijs',
    slug: 'BabyVisor', // Updated slug to match the project
    version: '1.0.0',
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
        'expo-router',
        [
            'expo-camera',
            {
                cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
                microphonePermission:
                    'Allow $(PRODUCT_NAME) to access your microphone',
                recordAudioAndroid: true,
            },
        ],
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
            'react-native-vision-camera',
            {
                cameraPermissionText:
                    '$(PRODUCT_NAME) needs access to your Camera.',
                enableMicrophonePermission: true,
                microphonePermissionText:
                    '$(PRODUCT_NAME) needs access to your Microphone.',
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
