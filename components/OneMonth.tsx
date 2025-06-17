import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    runOnJS,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated'
import {
    Camera,
    useCameraDevice,
    useFrameProcessor,
} from 'react-native-vision-camera'

const OneMonth = () => {
    const device = useCameraDevice('back')
    const shakeOffset = useSharedValue(0)
    const [isMoving, setIsMoving] = useState(false)

    // Имитация дрожания камеры
    useEffect(() => {
        shakeOffset.value = withRepeat(
            withTiming(10, { duration: 100 }),
            -1,
            true
        )
    }, [])

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'

        // 1. Размытие (имитация малой глубины резкости)
        // На практике нужно использовать внешнюю библиотеку типа ML Kit
        // Здесь просто помечаем кадр для последующей обработки
        runOnJS(setIsMoving)(true)

        // 2. Черно-белый + низкая контрастность
        // В реальности требуется native-модуль или шейдеры
        const params = {
            contrast: -0.5,
            saturation: 0,
            exposure: 0.7,
        }

        // 3. Передаем параметры в native-код (пример псевдокода)
        // __adjustFrame(frame, params);
    }, [])

    if (!device) return <View style={styles.container} />

    return (
        <View style={styles.container}>
            <Camera
                style={[
                    StyleSheet.absoluteFill,
                    isMoving && styles.motionBlur,
                    styles.bwFilter,
                ]}
                device={device}
                // format={useCameraFormat(device, [{ fps: 30 }])}
                frameProcessor={frameProcessor}
                photoHdr={true}
                exposure={0.7}
                isActive={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        overflow: 'hidden',
    },
    motionBlur: {
        transform: [
            { translateX: Math.random() * 10 - 5 },
            { translateY: Math.random() * 10 - 5 },
        ],
    },
    bwFilter: {
        filter: [
            { blur: 15 },
            { contrast: 0.5 },
            { grayscale: 1 },
            { brightness: 1.7 },
        ],
    },
})

export default OneMonth
