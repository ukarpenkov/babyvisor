import { ExpoConfig } from 'expo/config'
import 'ts-node/register' // Add this to import TypeScript files

const config: ExpoConfig = {
    name: 'BabyVisor',
    slug: 'BabyVisor',
    owner: 'yurijs',
    android: {
        package: 'com.yurijs.BabyVisor',
    },
    extra: {
        eas: {
            projectId: '77fdde13-76f7-4077-a49e-c4b153eca4f4',
        },
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
