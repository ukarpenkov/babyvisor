import { Text } from 'react-native'
import {
    Camera,
    useCameraDevices,
    useCameraPermission,
} from 'react-native-vision-camera'

export default function Settings() {
    const devices = useCameraDevices()
    const device = devices?.find((d) => d.position === 'back')
    const { hasPermission } = useCameraPermission()

    if (!hasPermission) return <Text>NOOO</Text>
    if (device == null) return <Text>NOOO DEVICE</Text>
    return (
        <Camera
            device={device}
            isActive={true}
        />
    )
}
