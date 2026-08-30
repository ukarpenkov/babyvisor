import { useIsFocused } from '@react-navigation/native'
import {
    Camera,
    CameraCapturedPicture,
    CameraView,
    PermissionResponse,
} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { EmptyState } from '../../components/ui/EmptyState'
import { MaterialButton } from '../../components/ui/MaterialButton'

export default function CameraScreen() {
    const isFocused = useIsFocused()
    const [cameraPermission, setCameraPermission] =
        useState<PermissionResponse | null>(null)
    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions()
    const [isCapturing, setIsCapturing] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)

    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            const camPerm = await Camera.requestCameraPermissionsAsync()
            if (!cancelled) {
                setCameraPermission(camPerm)
            }
            if (!mediaPermission) {
                await requestMediaPermission()
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current) return

        try {
            setIsCapturing(true)

            const photo: CameraCapturedPicture =
                await cameraRef.current.takePictureAsync()
            const asset = await MediaLibrary.createAssetAsync(photo.uri)

            setIsNavigating(true)
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
            <EmptyState
                icon="photo-camera"
                title="Нужен доступ к камере"
                message="Чтобы показать мир глазами малыша, приложению нужно разрешение на камеру."
            >
                <MaterialButton
                    title="Разрешить"
                    icon="check"
                    onPress={async () => {
                        const response =
                            await Camera.requestCameraPermissionsAsync()
                        setCameraPermission(response)
                    }}
                />
            </EmptyState>
        )
    }

    if (isNavigating) {
        return <View style={styles.container} />
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            {isFocused ? (
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    mode="picture"
                    active
                    ref={cameraRef}
                    onMountError={(event) => {
                        const message =
                            event.message ??
                            (event as { nativeEvent?: { message?: string } })
                                .nativeEvent?.message
                        console.error('Camera mount error:', message)
                        Alert.alert(
                            'Камера недоступна',
                            message || 'Не удалось открыть камеру'
                        )
                    }}
                />
            ) : null}
            <View style={styles.controls} pointerEvents="box-none">
                <Pressable
                    style={({ pressed }) => [
                        styles.shutterOuter,
                        (pressed || isCapturing) && styles.shutterPressed,
                    ]}
                    onPress={takePicture}
                    disabled={isCapturing || !isFocused}
                    accessibilityRole="button"
                    accessibilityLabel="Сделать фото"
                >
                    <View style={styles.shutterInner}>
                        {isCapturing ? (
                            <ActivityIndicator
                                size="small"
                                color="#1D6B7A"
                            />
                        ) : null}
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    controls: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
    },
    shutterOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shutterPressed: {
        opacity: 0.7,
    },
    shutterInner: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
