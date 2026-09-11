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
    AppState,
    AppStateStatus,
    Linking,
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
    const [permissionError, setPermissionError] = useState<string | null>(null)
    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions()
    const [isCapturing, setIsCapturing] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [isAppActive, setIsAppActive] = useState(
        AppState.currentState === 'active'
    )
    const mountRetries = useRef(0)

    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    const requestCameraAccess = async (): Promise<void> => {
        try {
            setPermissionError(null)
            const camPerm = await Camera.requestCameraPermissionsAsync()
            setCameraPermission(camPerm)
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось запросить разрешение на камеру'
            setPermissionError(message)
            setCameraPermission({
                granted: false,
                canAskAgain: true,
                status: 'undetermined',
                expires: 'never',
            } as PermissionResponse)
        }
    }

    useEffect(() => {
        void requestCameraAccess()
    }, [])

    useEffect(() => {
        const onChange = (next: AppStateStatus) => {
            setIsAppActive(next === 'active')
        }
        const sub = AppState.addEventListener('change', onChange)
        return () => sub.remove()
    }, [])

    const syncPreview = () => {
        if (!cameraPermission?.granted || !cameraRef.current) return
        if (isFocused && isAppActive) {
            void cameraRef.current.resumePreview()
        } else {
            setIsReady(false)
            void cameraRef.current.pausePreview()
        }
    }

    useEffect(() => {
        syncPreview()
    }, [isFocused, isAppActive, cameraPermission?.granted])

    useEffect(() => {
        if (!isFocused || !isAppActive || !cameraPermission?.granted || isReady) {
            return
        }
        const timer = setTimeout(() => {
            syncPreview()
        }, 1500)
        return () => clearTimeout(timer)
    }, [isFocused, isAppActive, cameraPermission?.granted, isReady])

    const retryMount = (): boolean => {
        if (mountRetries.current < 3) {
            mountRetries.current += 1
            setIsReady(false)
            syncPreview()
            return true
        }
        return false
    }

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current) return

        try {
            setIsCapturing(true)

            if (!mediaPermission?.granted) {
                const media = await requestMediaPermission()
                if (!media?.granted) {
                    Alert.alert(
                        'Нет доступа к галерее',
                        'Разрешите сохранение фото, чтобы открыть снимок в редакторе.'
                    )
                    return
                }
            }

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
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Не удалось сделать фото'
            console.error('Ошибка при съёмке фото:', error)
            Alert.alert('Ошибка', message)
        } finally {
            setIsCapturing(false)
        }
    }

    if (!cameraPermission && !permissionError) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        )
    }

    if (!cameraPermission?.granted) {
        const blocked = cameraPermission?.canAskAgain === false
        return (
            <EmptyState
                icon="photo-camera"
                title="Нужен доступ к камере"
                message={
                    permissionError ||
                    (blocked
                        ? 'Разрешение отклонено. Включите камеру в настройках приложения.'
                        : 'Чтобы показать мир глазами малыша, приложению нужно разрешение на камеру.')
                }
            >
                <MaterialButton
                    title={blocked ? 'Открыть настройки' : 'Разрешить'}
                    icon={blocked ? 'settings' : 'check'}
                    onPress={async () => {
                        if (blocked) {
                            await Linking.openSettings()
                            return
                        }
                        await requestCameraAccess()
                    }}
                />
            </EmptyState>
        )
    }

    if (isNavigating) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <CameraView
                style={styles.preview}
                facing="back"
                mode="picture"
                ratio="16:9"
                animateShutter={false}
                collapsable={false}
                ref={cameraRef}
                onCameraReady={() => {
                    setIsReady(true)
                    mountRetries.current = 0
                }}
                onMountError={(event) => {
                    const message =
                        event.message ??
                        (event as { nativeEvent?: { message?: string } })
                            .nativeEvent?.message
                    console.error('Camera mount error:', message)
                    if (retryMount()) {
                        return
                    }
                    Alert.alert(
                        'Камера недоступна',
                        message || 'Не удалось открыть камеру'
                    )
                }}
            />
            {!isReady ? (
                <View style={styles.previewLoading} pointerEvents="none">
                    <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
            ) : null}
            <View style={styles.controls} pointerEvents="box-none">
                <Pressable
                    style={({ pressed }) => [
                        styles.shutterOuter,
                        (pressed || isCapturing) && styles.shutterPressed,
                    ]}
                    onPress={takePicture}
                    disabled={isCapturing || !isFocused || !isReady}
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
    loading: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    preview: {
        flex: 1,
    },
    previewLoading: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
