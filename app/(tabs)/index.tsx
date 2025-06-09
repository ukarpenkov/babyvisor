import { StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
    // const device = useCameraDevice('back')
    // const { hasPermission } = useCameraPermission()

    // if (!hasPermission) return <ThemedText>No camera device found.</ThemedText>
    // if (device == null) return <ThemedText>No camera device found.</ThemedText>
    return (
        <View>
            <Text style={styles.aaa}>Hellrrrrrrrrrrrrrrrro</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello43444</Text>
        </View>

        // {/* <Camera
        //     style={StyleSheet.absoluteFill}
        //     device={device}
        //     isActive={true}
        // /> */}
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    aaa: {
        marginTop: 100,
    },
})
