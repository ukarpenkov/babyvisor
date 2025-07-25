import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useIsFocused } from '@react-navigation/native'
import {
    Camera,
    CameraCapturedPicture,
    CameraView,
    PermissionResponse,
} from 'expo-camera'
import * as FileSystem from 'expo-file-system'
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
    const [permission, setPermission] = useState<PermissionResponse | null>(
        null
    )
    const [mediaPermission, requestMediaPermission] =
        MediaLibrary.usePermissions()
    const [isCapturing, setIsCapturing] = useState(false)
    const isFocused = useIsFocused()
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const response = await Camera.requestCameraPermissionsAsync()
            setPermission(response)
            if (!mediaPermission) await requestMediaPermission()
        })()
    }, [])

    const takePicture = async (): Promise<void> => {
        if (cameraRef.current) {
            try {
                setIsCapturing(true)
                const photo: CameraCapturedPicture =
                    await cameraRef.current.takePictureAsync({ base64: false })

                const asset = await MediaLibrary.createAssetAsync(photo.uri)

                if (!asset) {
                    throw new Error('Не удалось сохранить фото в галерею')
                }

                setTimeout(async () => {
                    const galleryPhotos = await MediaLibrary.getAssetsAsync({
                        first: 1,
                        mediaType: 'photo',
                        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
                    })

                    if (galleryPhotos.assets.length > 0) {
                        const latestPhoto = galleryPhotos.assets[0]
                        const base64 = await FileSystem.readAsStringAsync(
                            latestPhoto.uri,
                            {
                                encoding: FileSystem.EncodingType.Base64,
                            }
                        )

                        const mimeType = 'image/jpeg'

                        router.push({
                            pathname: './editor',
                            params: {
                                base64: `data:${mimeType};base64,${base64}`,
                                showConfirmation: 'true',
                            },
                        })
                    } else {
                        Alert.alert(
                            'Ошибка',
                            'Не удалось найти последнее фото в галерее'
                        )
                    }
                }, 300) 
            } catch (error: any) {
                console.error('Error taking picture:', error)
                Alert.alert(
                    'Ошибка',
                    error.message || 'Не удалось сделать фото'
                )
            } finally {
                setIsCapturing(false)
            }
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
