import React, { useEffect, useState } from 'react'
import { Button, Linking, StyleSheet, Text, View } from 'react-native'
import type { CameraProps } from 'react-native-vision-camera'
import {
    Camera,
    useCameraDevice,
    useSkiaFrameProcessor,
} from 'react-native-vision-camera'

import { Skia } from '@shopify/react-native-skia'

// Вспомогательная функция для создания матрицы преобразования цвета
// (не может быть внутри worklet)
const createColorMatrix = (matrix: number[]) => {
    'worklet'
    return Skia.ColorFilter.MakeMatrix(matrix)
}

const OneMonth = () => {
    const [hasPermission, setHasPermission] = useState(false)
    const device = useCameraDevice('back')

    useEffect(() => {
        // Запрос прав на использование камеры при монтировании компонента
        ;(async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'granted')
        })()
    }, [])

    // 1. Размытие (малая глубина резкости) и 2. Сильное размытие
    // Мы создаем сильный эффект размытия по Гауссу.
    // Прямое управление f/1.8 невозможно, но сильное размытие имитирует малую глубину резкости.
    const blurFilter = Skia.ImageFilter.MakeBlur(8, 8, Skia.TileMode.Clamp)

    // 3. Уменьшение контраста и 4. Удаление цвета (черно-белое)
    // Мы объединим эти два эффекта в одну цветовую матрицу для производительности.
    const createCreativeColorFilter = () => {
        'worklet'
        // Насыщенность (Saturation) 0%
        const s = 0
        // Контраст (Contrast) -50%
        const c = 0.5

        // Матрица для преобразования в оттенки серого (Luminance-preserving)
        const grayscaleMatrix = [
            0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152, 0.0722, 0, 0, 0.2126,
            0.7152, 0.0722, 0, 0, 0, 0, 0, 1, 0,
        ]

        // Матрица для уменьшения контраста
        const contrastValue = (1.0 - c) / 2.0
        const contrastMatrix = [
            c,
            0,
            0,
            0,
            contrastValue,
            0,
            c,
            0,
            0,
            contrastValue,
            0,
            0,
            c,
            0,
            contrastValue,
            0,
            0,
            0,
            1,
            0,
        ]

        // Прямое создание матрицы для оттенков серого и контраста
        const sr = (1 - s) * 0.2126
        const sg = (1 - s) * 0.7152
        const sb = (1 - s) * 0.0722
        const t = (1.0 - c) / 2.0

        const matrix = [
            c * (sr + s),
            c * sg,
            c * sb,
            0,
            t,
            c * sr,
            c * (sg + s),
            c * sb,
            0,
            t,
            c * sr,
            c * sg,
            c * (sb + s),
            0,
            t,
            0,
            0,
            0,
            1,
            0,
        ]

        return createColorMatrix(matrix)
    }

    // 5. Пересвеченные или затемненные участки
    // Для этого мы будем использовать пропс `exposure` компонента Camera.
    // Здесь мы просто задаем значение, но его можно менять динамически.
    const exposure = 0.5 // +0.5 EV для легкого пересвета

    // 6. Дрожание камеры (motion blur)
    // Достигается отключением стабилизации видео.
    const videoStabilizationMode: CameraProps['videoStabilizationMode'] = 'off'

    const frameProcessor = useSkiaFrameProcessor((frame) => {
        'worklet'
        // Создаем объект Paint, к которому применим фильтры
        const paint = Skia.Paint()

        // Создаем фильтры внутри worklet
        const colorFilter = createCreativeColorFilter()

        // Совмещаем фильтры: сначала цвет, потом размытие
        paint.setImageFilter(
            Skia.ImageFilter.MakeCompose(
                blurFilter, // Внешний фильтр (размытие)
                Skia.ImageFilter.MakeColorFilter(colorFilter, null) // Внутренний фильтр (цвет/контраст)
            )
        )

        // Рисуем обработанный кадр на холст
        frame.draw(paint)
    }, [])

    // Рендеринг в зависимости от статуса
    if (device == null) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Камера не найдена</Text>
            </View>
        )
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Нет доступа к камере.</Text>
                <Button
                    title="Предоставить доступ"
                    onPress={() => Linking.openSettings()}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                // Включаем Frame Processor для обработки в реальном времени
                frameProcessor={frameProcessor}
                // Настройки для других эффектов
                exposure={exposure}
                videoStabilizationMode={videoStabilizationMode}
                // Устанавливаем формат с поддержкой HDR для лучшего качества исходного изображения
                format={device.formats.find((f) => f.supportsPhotoHdr)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
})

export default OneMonth
