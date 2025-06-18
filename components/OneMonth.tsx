import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated'

import type { CameraProps } from 'react-native-vision-camera'
import {
    Camera,
    useCameraDevice,
    useCameraFormat,
} from 'react-native-vision-camera'

// Для анимации некоторых свойств
const AnimatedCamera = Animated.createAnimatedComponent(Camera)

const OneMonth = () => {
    const device = useCameraDevice('back')

    // 1. Размытие (Малая глубина резкости, f/1.8 и боке)
    // Прямое управление диафрагмой (f-stop) в Vision Camera невозможно.
    // Однако, можно выбрать формат, который поддерживает наилучшее качество для фото,
    // что на некоторых устройствах может активировать портретный режим с боке.
    // Для настоящего боке потребуется Frame Processor и анализ глубины кадра.
    const format = useCameraFormat(device, [
        { photoHdr: true },
        { videoStabilizationMode: 'cinematic-extended' }, // Может улучшить фокусировку на объекте
    ])

    // 2. Сильное размытие и низкая резкость
    // Этот эффект не контролируется пропсами. Его нужно реализовывать
    // через Frame Processor, применяя фильтр размытия (например, с помощью Skia).

    // 3. Уменьшение контраста и 4. Удаление цвета (оттенки серого)
    // Эти эффекты также требуют обработки кадра.
    // В Frame Processor вы бы применили матрицу для преобразования цвета,
    // чтобы уменьшить контраст и установить насыщенность (saturation) в 0.

    // 5. Пересвеченные или затемненные участки (highlights/shadows)
    // Можно управлять общей экспозицией. Значение от minExposure до maxExposure.
    // Например, +1 сделает изображение ярче, -1 — темнее.
    const exposure = useSharedValue(0) // Нейтральная экспозиция по умолчанию
    // Чтобы сделать пересвеченным, увеличьте значение, например: const exposure = useSharedValue(1);
    // Чтобы сделать затемненным, уменьшите: const exposure = useSharedValue(-1);

    const animatedProps = useDerivedValue<Partial<CameraProps>>(() => {
        return {
            exposure: exposure.value,
        }
    }, [exposure])

    // 6. Дрожание камеры (motion blur)
    // Vision Camera нацелена на *стабилизацию* изображения.
    // Чтобы создать эффект дрожания, нужно отключить стабилизацию.
    const videoStabilizationMode: CameraProps['videoStabilizationMode'] = 'off'

    if (device == null) {
        // Обработка случая, когда камера не найдена
        return <View style={styles.container} />
    }

    return (
        <View style={styles.container}>
            <AnimatedCamera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                format={format}
                photo={true}
                // animatedProps={animatedProps} // Раскомментируйте для управления экспозицией
                videoStabilizationMode={videoStabilizationMode}
                // Для реализации эффектов 2, 3 и 4 здесь нужно было бы добавить frameProcessor
                // frameProcessor={frameProcessor}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
})

export default OneMonth
