import {
    CameraView,
    useCameraPermissions,
} from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import { EmptyState } from '../../components/ui/EmptyState'
import { MaterialButton } from '../../components/ui/MaterialButton'

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions()
    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions()
    const [isCapturing, setIsCapturing] = useState(false)
    const askedOnce = useRef(false)
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        if (!permission || askedOnce.current) return
        askedOnce.current = true
        if (!permission.granted) {
            void requestPermission()
        }
    }, [permission, requestPermission])

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current || isCapturing) return

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

            const photo = await cameraRef.current.takePictureAsync()
            const asset = await MediaLibrary.createAssetAsync(photo.uri)

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
            Alert.alert('Ошибка', message)
        } finally {
            setIsCapturing(false)
        }
    }

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        )
    }

    if (!permission.granted) {
        const blocked = permission.canAskAgain === false
        return (
            <EmptyState
                icon="photo-camera"
                title="Нужен доступ к камере"
                message={
                    blocked
                        ? 'Разрешение отклонено. Включите камеру в настройках приложения.'
                        : 'Чтобы показать мир глазами малыша, приложению нужно разрешение на камеру.'
                }
            >
                <MaterialButton
                    title={blocked ? 'Открыть настройки' : 'Разрешить'}
                    icon={blocked ? 'settings' : 'check'}
                    onPress={() => {
                        if (blocked) {
                            void Linking.openSettings()
                            return
                        }
                        void requestPermission()
                    }}
                />
            </EmptyState>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <CameraView
                ref={cameraRef}
                style={styles.preview}
                facing="back"
                mode="picture"
                ratio="16:9"
                animateShutter={false}
                collapsable={false}
                onMountError={(event) => {
                    Alert.alert(
                        'Камера недоступна',
                        event.message || 'Не удалось открыть камеру'
                    )
                }}
            />
            <View style={styles.controls} pointerEvents="box-none">
                <Pressable
                    style={({ pressed }) => [
                        styles.shutterOuter,
                        (pressed || isCapturing) && styles.shutterPressed,
                    ]}
                    onPress={takePicture}
                    disabled={isCapturing}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
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
