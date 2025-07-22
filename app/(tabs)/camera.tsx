import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useIsFocused } from '@react-navigation/native'
import {
    Camera,
    CameraCapturedPicture,
    CameraView,
    PermissionResponse,
} from 'expo-camera'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Button,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default function CameraScreen() {
    const [permission, setPermission] = useState<PermissionResponse | null>(
        null
    )
    const [isCapturing, setIsCapturing] = useState(false)
    const isFocused = useIsFocused()
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const response = await Camera.requestCameraPermissionsAsync()
            setPermission(response)
        })()
    }, [])

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current || isCapturing) return
        try {
            setIsCapturing(true)
            const photo: CameraCapturedPicture =
                await cameraRef.current.takePictureAsync({
                    base64: true,
                    quality: 1,
                    skipProcessing: false,
                })

            router.push({
                pathname: './editor',
                params: {
                    imageUri: photo.uri,
                    base64: photo.base64,
                },
            })
        } catch (err) {
            console.error('Ошибка при съемке:', err)
        } finally {
            setIsCapturing(false)
        }
    }

    if (!permission) {
        return <View style={styles.container} />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Приложению нужно разрешение для использования камеры
                </Text>
                <Button
                    onPress={async () => {
                        const response =
                            await Camera.requestCameraPermissionsAsync()
                        setPermission(response)
                    }}
                    title="Дать разрешение"
                />
            </View>
        )
    }

    if (!isFocused) {
        return <View style={styles.container} />
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={takePicture}
                        disabled={isCapturing}
                    >
                        {isCapturing ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <FontAwesome
                                name="circle-o"
                                size={64}
                                color="white"
                            />
                        )}
                    </Pressable>
                </View>
            </CameraView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
})
