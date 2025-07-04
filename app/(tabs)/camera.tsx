// app/(tabs)/camera.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useIsFocused } from '@react-navigation/native' // ИЗМЕНЕНИЕ: Импортируем хук
import {
    Camera,
    CameraCapturedPicture,
    CameraView,
    PermissionResponse,
} from 'expo-camera'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Button, Pressable, StyleSheet, Text, View } from 'react-native'

export default function CameraScreen() {
    const [permission, setPermission] = useState<PermissionResponse | null>(
        null
    )
    const isFocused = useIsFocused() // ИЗМЕНЕНИЕ: Получаем статус фокуса экрана
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    useEffect(() => {
        ;(async () => {
            const response = await Camera.requestCameraPermissionsAsync()
            setPermission(response)
        })()
    }, [])

    const takePicture = async (): Promise<void> => {
        if (cameraRef.current) {
            const photo: CameraCapturedPicture =
                await cameraRef.current.takePictureAsync()
            router.push({
                pathname: './editor',
                params: { imageUri: photo.uri },
            })
        }
    }

    if (!permission) {
        // Можно оставить пустой View для момента загрузки статуса разрешений
        return <View />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    Нам нужно разрешение для использования камеры
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

    // ИЗМЕНЕНИЕ: Добавляем проверку на фокус.
    // Если экран не в фокусе, мы ничего не рендерим, чтобы освободить камеру.
    if (!isFocused) {
        return <View />
    }

    return (
        <View style={styles.container}>
            {/* Рендерим CameraView только если экран в фокусе */}
            <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={takePicture}>
                        <FontAwesome name="circle-o" size={64} color="white" />
                    </Pressable>
                </View>
            </CameraView>
        </View>
    )
}

// Стили остаются такими же
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    camera: { flex: 1 },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: { flex: 1, alignSelf: 'flex-end', alignItems: 'center' },
})
