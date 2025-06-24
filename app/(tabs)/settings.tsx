import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera'

export default function Settings() {
    const device = useCameraDevice('back')
    const { hasPermission } = useCameraPermission()

    if (!hasPermission) return <Text>No permission</Text>
    if (device == null) return <Text>No device</Text>

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text>Camera</Text>
                <Camera
                    device={device}
                    isActive={true}
                    style={styles.camera}
                    exposure={-5}
                    photo={true}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: Platform.OS === 'android' ? 24 : 0,
    },
    camera: {
        flex: 1,
    },
})
