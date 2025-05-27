import { StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
    // const device = useCameraDevice('back')
    // const { hasPermission } = useCameraPermission()

    // if (!hasPermission) return <ThemedText>No camera device found.</ThemedText>
    // if (device == null) return <ThemedText>No camera device found.</ThemedText>
    return (
        <View>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello</Text>
            <Text style={styles.aaa}>Hello43444</Text>
        </View>
        // <ParallaxScrollView
        //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        //   headerImage={
        //     <Image
        //       source={require("assets/images/partial-react-logo.png")}
        //       style={styles.reactLogo}
        //     />
        //   }
        // >
        // <Camera
        //     style={StyleSheet.absoluteFill}
        //     device={device}
        //     isActive={true}
        // />
        //   <ThemedView style={styles.titleContainer}>
        //     <ThemedText type="title">BabyVisor!</ThemedText>
        //     <HelloWave />
        //   </ThemedView>
        //   <ThemedView style={styles.stepContainer}>
        //     <ThemedText type="subtitle">Step 1: Try it!!</ThemedText>
        //     <ThemedText>
        //       Edit{" "}
        //       <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
        //       to see changes. Press{" "}
        //       <ThemedText type="defaultSemiBold">
        //         {Platform.select({
        //           ios: "cmd + d",
        //           android: "cmd + m",
        //           web: "F12",
        //         })}
        //       </ThemedText>{" "}
        //       to open developer tools.
        //     </ThemedText>
        //   </ThemedView>
        //   <ThemedView style={styles.stepContainer}>
        //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        //     <ThemedText>
        //       {`Tap the Explore tab to learn more about what's included in this starter app.`}
        //     </ThemedText>
        //   </ThemedView>
        //   <ThemedView style={styles.stepContainer}>
        //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        //     <ThemedText>
        //       {`When you're ready, run `}
        //       <ThemedText type="defaultSemiBold">
        //         npm run reset-project
        //       </ThemedText>{" "}
        //       to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
        //       directory. This will move the current{" "}
        //       <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
        //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        //     </ThemedText>
        //   </ThemedView>
        // </ParallaxScrollView>
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
