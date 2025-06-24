import { Camera } from 'expo-camera'
import { manipulateAsync } from 'expo-image-manipulator'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
export default function Settings() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const cameraRef = useRef<Camera>(null)

    useEffect(() => {
        ;(async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    if (hasPermission === null) {
        return <View />
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    // Функция для применения эффектов к каждому кадру (симуляция)
    const applyLiveEffects = async () => {
        if (cameraRef.current) {
            const options = {
                quality: 0.1, // Низкое качество для ускорения обработки
                base64: true,
                exif: false,
            }

            const photo = await cameraRef.current.takePictureAsync(options)

            // Применяем эффекты
            const manipulatedImage = await manipulateAsync(
                photo.uri,
                [
                    { resize: { width: 200 } }, // Уменьшаем для производительности
                    { blur: 20 }, // Сильное размытие
                    { grayscale: true }, // Удаление цвета
                    { contrast: 0.5 }, // Уменьшение контраста
                ],
                { base64: true }
            )

            // Здесь можно отобразить обработанное изображение вместо превью
        }
    }

    // Используем интервал для симуляции "дрожания камеры"
    useEffect(() => {
        const interval = setInterval(() => {
            applyLiveEffects()
        }, 100) // Частота обновления эффектов

        return () => clearInterval(interval)
    }, [])

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.camera}
                type={CameraType.back}
                autoFocus={true}
                whiteBalance={Camera.Constants.WhiteBalance.auto}
                zoom={0}
                // Настройки, которые поддерживаются нативно
                pictureSize="640x480"
            >
                <View style={styles.overlay}>
                    {/* Здесь можно добавить элементы интерфейса */}
                </View>
            </Camera>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
