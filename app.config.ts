import { ExpoConfig } from 'expo/config'
import 'ts-node/register' // Add this to import TypeScript files

const config: ExpoConfig = {
    name: 'BabyVisor',
    slug: 'BabyVisor',
    android: {
        package: 'com.yurijs.BabyVisor',
    },
    plugins: [
        [
            'react-native-vision-camera',
            {
                cameraPermissionText: 'BabyVisor needs access to your Camera.',
            },
        ],
    ],
}

export default config
