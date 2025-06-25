import { BlurView } from 'expo-blur'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { useState } from 'react'
import {
    Button,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

export default function Settings() {
    const [facing, setFacing] = useState<CameraType>('back')
    const [permission, requestPermission] = useCameraPermissions()
    const windowWidth = Dimensions.get('window').width
    const windowHeight = Dimensions.get('window').height
    const focusSize = 150 // Размер области фокусировки

    if (!permission) {
        return <View />
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        )
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === 'back' ? 'front' : 'back'))
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                // Добавляем автофокус и настройку дистанции фокусировки
                autofocus={'off'}
                // Устанавливаем фокус на 30 см (focusDepth property removed as it is not supported)
            >
                {/* Размытие всего, кроме центральной области */}
                <View style={styles.blurContainer}>
                    <BlurView
                        style={[
                            styles.blurView,
                            {
                                width: windowWidth,
                                height: (windowHeight - focusSize) / 2,
                            },
                        ]}
                        intensity={50}
                        tint="dark"
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <BlurView
                            style={{
                                width: (windowWidth - focusSize) / 2,
                                height: focusSize,
                            }}
                            intensity={50}
                            tint="dark"
                        />
                        {/* Прозрачное окно в центре (неразмытая область) */}
                        <View style={{ width: focusSize, height: focusSize }} />
                        <BlurView
                            style={{
                                width: (windowWidth - focusSize) / 2,
                                height: focusSize,
                            }}
                            intensity={50}
                            tint="dark"
                        />
                    </View>
                    <BlurView
                        style={{
                            width: windowWidth,
                            height: (windowHeight - focusSize) / 2,
                        }}
                        intensity={50}
                        tint="dark"
                    />
                </View>

                {/* Индикатор фокусировки (рамка) */}
                <View
                    style={[
                        styles.focusFrame,
                        {
                            width: focusSize,
                            height: focusSize,
                            left: (windowWidth - focusSize) / 2,
                            top: (windowHeight - focusSize) / 2,
                        },
                    ]}
                />

                {/* Черно-белый фильтр (серый оверлей) */}
                <View style={styles.grayscaleOverlay} />

                {/* Затемнение на 30% (черный оверлей с opacity 0.3) */}
                <View style={styles.darkenOverlay} />

                {/* Увеличение контрастности на 50% */}
                <View style={styles.contrastOverlay} />

                {/* Эффект вибрации/пониженной резкости */}
                <View style={styles.vibrationOverlay}>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.vibrationLine,
                                {
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 3}%`,
                                    height: `${Math.random() * 3}%`,
                                    opacity: Math.random() * 0.7,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Кнопка переворота камеры */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraFacing}
                    >
                        <Text style={styles.text}>🐬</Text>
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
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    blurContainer: {
        flex: 1,
        position: 'absolute',
    },
    blurView: {
        width: '100%',
    },
    focusFrame: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        backgroundColor: 'transparent',
    },
    grayscaleOverlay: {
        flex: 1,
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    darkenOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    contrastOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        mixBlendMode: 'overlay',
    },
    vibrationOverlay: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    vibrationLine: {
        position: 'absolute',
        backgroundColor: 'white',
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
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
})
