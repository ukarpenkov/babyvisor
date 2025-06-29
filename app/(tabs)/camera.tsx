import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const CameraTab: React.FC = () => {
    // Типизируем состояние для направления камеры
    const [facing, setFacing] = useState<CameraType>('back')
    const [permission, requestPermission] = useCameraPermissions()
    // Типизируем ref для доступа к методам CameraView
    const cameraRef = useRef<CameraView>(null)
    const router = useRouter()

    if (!permission) {
        // Разрешения камеры еще загружаются.
        return <View />
    }

    if (!permission.granted) {
        // Разрешения камеры еще не предоставлены.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    Нам нужно ваше разрешение, чтобы показать камеру
                </Text>
                <Button
                    onPress={requestPermission}
                    title="предоставить разрешение"
                />
            </View>
        )
    }

    async function takePicture() {
        // Проверяем, что ref существует
        if (cameraRef.current) {
            // Результат съемки имеет тип CameraCapturedPicture
            const photo = await cameraRef.current.takePictureAsync()
            if (photo) {
                // Передаем uri как параметр
                router.push({
                    pathname: '/preview',
                    params: { uri: photo.uri },
                })
            }
        }
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePicture}
                    >
                        <Text style={styles.text}>Сделать фото</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 15,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
})

export default CameraTab
