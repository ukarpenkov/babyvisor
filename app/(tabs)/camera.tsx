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
                    await cameraRef.current.takePictureAsync({ base64: true })

                const fileName = photo.uri.split('/').pop()
                const newPath = `${FileSystem.cacheDirectory}${fileName}`
                await FileSystem.copyAsync({
                    from: photo.uri,
                    to: newPath,
                })

                const fileInfo = await FileSystem.getInfoAsync(newPath)
                if (fileInfo.exists) {
                    const mimeType = newPath.endsWith('.png')
                        ? 'image/png'
                        : newPath.endsWith('.jpg') || newPath.endsWith('.jpeg')
                        ? 'image/jpeg'
                        : 'image/*'

                    const base64 = await FileSystem.readAsStringAsync(newPath, {
                        encoding: FileSystem.EncodingType.Base64,
                    })

                    console.log('Photo URI:', photo.uri) 
                    console.log(
                        'Photo Base64 (first 100 chars):',
                        photo.base64?.slice(0, 100)
                    ) 
                    console.log('New Path:', newPath) 
                    console.log('File Info:', fileInfo) 

                    router.push({
                        pathname: './editor',
                        params: {
                            imageUri: newPath,
                            base64: `data:${mimeType};base64,${base64}`,
                        },
                    })
                } else {
                    throw new Error('File does not exist after saving')
                }
            } catch (error) {
                console.error('Error taking picture:', error)
                Alert.alert('Ошибка', 'Не удалось сделать фото')
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
