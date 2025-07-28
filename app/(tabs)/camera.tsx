import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useIsFocused } from '@react-navigation/native'
import {
    Camera,
    CameraCapturedPicture,
    CameraView,
    PermissionResponse,
} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Button,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default function CameraScreen() {
    const [cameraPermission, setCameraPermission] =
        useState<PermissionResponse | null>(null)
    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions()
    const [isCapturing, setIsCapturing] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)

    const isFocused = useIsFocused()
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const camPerm = await Camera.requestCameraPermissionsAsync()
            setCameraPermission(camPerm)
            if (!mediaPermission) {
                await requestMediaPermission()
            }
        })()
    }, [])

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current) return

        try {
            setIsCapturing(true)

            const photo: CameraCapturedPicture =
                await cameraRef.current.takePictureAsync()

            // Сохраняем в галерею
            const asset = await MediaLibrary.createAssetAsync(photo.uri)

            setIsNavigating(true)

            // Переходим на экран редактора и передаём URI
            router.push({
                pathname: '/editor',
                params: {
                    imageUri: asset.uri,
                    showConfirmation: 'true',
                },
            })
        } catch (error: any) {
            console.error('Ошибка при съёмке фото:', error)
            Alert.alert('Ошибка', error.message || 'Не удалось сделать фото')
        } finally {
            setIsCapturing(false)
        }
    }

    if (!cameraPermission) {
        return <View style={styles.container} />
    }

    if (!cameraPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Приложению нужно разрешение для использования камеры
                </Text>
                <Button
                    onPress={async () => {
                        const response =
                            await Camera.requestCameraPermissionsAsync()
                        setCameraPermission(response)
                    }}
                    title="Дать разрешение"
                />
            </View>
        )
    }

    if (!isFocused || isNavigating) {
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
