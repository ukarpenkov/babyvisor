import { StyleSheet, Text, View } from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera'

export default function Settings() {
    const device = useCameraDevice('back')
    const { hasPermission } = useCameraPermission()

    if (!hasPermission) return <Text>No</Text>
    if (device == null) return <Text>No</Text>
    return (
        <View>
            <Text>Camera</Text>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
        </View>
    )
}
