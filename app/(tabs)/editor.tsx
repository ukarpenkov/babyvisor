import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    ImageStyle,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native'
import ViewShot from 'react-native-view-shot'

interface FilterConfig {
    name: string
    imageStyle?: ImageStyle
    overlayStyle?: StyleProp<ViewStyle>
}

type EditorScreenParams = {
    imageUri?: string
}

// ИЗМЕНЕНИЕ: Полностью переработанный массив фильтров для имитации зрения по месяцам
const FILTERS: FilterConfig[] = [
    { name: 'Оригинал', imageStyle: {}, overlayStyle: {} },
    {
        name: 'Новорожденный',
        imageStyle: { blurRadius: 20 }, // Очень сильное размытие
        overlayStyle: {
            backgroundColor: '#FFF',
            mixBlendMode: 'color',
        },
    },
    {
        name: '1 месяц',
        imageStyle: { blurRadius: 15 }, // Сильное размытие
        overlayStyle: {
            backgroundColor: '#FFF',
            mixBlendMode: 'color',
        },
    },
    {
        name: '2 месяца',
        imageStyle: { blurRadius: 10 }, // Все еще размыто, но лучше
        overlayStyle: {
            backgroundColor: '#FFF',
            mixBlendMode: 'color',
        },
    },
    {
        name: '3 месяца',
        imageStyle: {
            blurRadius: 8,
            filter: 'contrast(1.2) grayscale(100%)', // Сначала обесцвечиваем всё
        },
        overlayStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            mixBlendMode: 'overlay',
        },
        // Добавляем дополнительный слой для выделения красных/желтых цветов
        additionalLayer: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
                'linear-gradient(to bottom, rgba(255, 0, 0, 0.3), rgba(255, 255, 0, 0.3))',
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none', 
        },
    },
    {
        name: '4 месяца',
        imageStyle: { blurRadius: 6 }, // Развивается глубина восприятия
        // Наложение почти не требуется, цвета становятся насыщеннее
        overlayStyle: {
            backgroundColor: 'rgba(250, 220, 220, 0.05)',
            mixBlendMode: 'normal',
        },
    },
    {
        name: '6 месяцев',
        imageStyle: { blurRadius: 4 }, // Хорошая четкость, почти как у взрослых
        overlayStyle: {}, // Цветовое зрение хорошо развито
    },
    {
        name: '8 месяцев',
        imageStyle: { blurRadius: 2 }, // Зрение становится еще острее
        overlayStyle: {},
    },
    {
        name: '10 месяцев',
        imageStyle: { blurRadius: 1 }, // Очень близко к идеальному
        overlayStyle: {},
    },
    {
        name: '1 год',
        imageStyle: { blurRadius: 0 }, // Зрение четкое, как у взрослого
        overlayStyle: {},
    },
]

export default function EditorScreen() {
    const params = useLocalSearchParams<EditorScreenParams>()
    const router = useRouter()
    const viewShotRef = useRef<ViewShot>(null)

    const [imageUri, setImageUri] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<FilterConfig | null>(
        FILTERS[0]
    )
    const [mediaLibraryPermission, requestMediaLibraryPermission] =
        MediaLibrary.usePermissions()

    useEffect(() => {
        if (params.imageUri && params.imageUri !== imageUri) {
            setImageUri(params.imageUri)
            setShowConfirmation(true)
            setShowFilters(false)
            setSelectedFilter(FILTERS[0])
        }
    }, [params.imageUri])

    useEffect(() => {
        if (!mediaLibraryPermission) {
            requestMediaLibraryPermission()
        }
    }, [])

    const handleClear = () => {
        setImageUri(null)
        setShowConfirmation(false)
        setShowFilters(false)
        setSelectedFilter(FILTERS[0])
        router.setParams({ imageUri: undefined })
    }

    const pickImageAsync = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        })

        if (!result.canceled) {
            setImageUri(result.assets[0].uri)
            setShowConfirmation(false)
            setShowFilters(true)
            setSelectedFilter(FILTERS[0])
        } else {
            console.log('Выбор изображения отменен')
        }
    }

    const handleRetake = (): void => {
        setImageUri(null)
        router.setParams({ imageUri: undefined })
        router.push('/camera')
    }

    const handleConfirm = (): void => {
        setShowConfirmation(false)
        setShowFilters(true)
    }

    const saveImage = async (): Promise<void> => {
        if (!mediaLibraryPermission?.granted) {
            Alert.alert(
                'Нет разрешений',
                'Нужно разрешение для сохранения фото.'
            )
            return
        }
        if (!viewShotRef.current) return

        try {
            const localUri = await viewShotRef.current.capture()
            if (localUri) {
                await MediaLibrary.saveToLibraryAsync(localUri)
                Alert.alert('Сохранено!', 'Фото успешно сохранено в галерею.')
            }
        } catch (e) {
            console.log(e)
            Alert.alert('Ошибка', 'Не удалось сохранить фото.')
        }
    }

    if (!imageUri) {
        return (
            <View style={styles.container}>
                <Pressable
                    style={styles.galleryButton}
                    onPress={pickImageAsync}
                >
                    <FontAwesome name="image" size={24} color="white" />
                    <Text style={styles.galleryButtonText}>
                        Выбрать фото из галереи
                    </Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
                style={styles.imageContainer}
            >
                <Image
                    source={{ uri: imageUri }}
                    style={[
                        StyleSheet.absoluteFill,
                        selectedFilter?.imageStyle,
                    ]}
                    contentFit="contain"
                    blurRadius={selectedFilter?.imageStyle?.blurRadius ?? 0}
                />
                {selectedFilter?.overlayStyle && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            selectedFilter.overlayStyle,
                        ]}
                    />
                )}
            </ViewShot>

            <View style={styles.topButtonsContainer}>
                {selectedFilter && selectedFilter.name !== 'Оригинал' && (
                    <Pressable style={styles.iconButton} onPress={saveImage}>
                        <FontAwesome name="save" size={24} color="white" />
                    </Pressable>
                )}
                <Pressable style={styles.iconButton} onPress={handleClear}>
                    <FontAwesome name="trash" size={24} color="white" />
                </Pressable>
            </View>

            {showConfirmation && (
                <View style={styles.confirmationContainer}>
                    <Pressable
                        style={[
                            styles.choiceButton,
                            { backgroundColor: '#4CAF50' },
                        ]}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.choiceButtonText}>Ок фото</Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.choiceButton,
                            { backgroundColor: '#f44336' },
                        ]}
                        onPress={handleRetake}
                    >
                        <Text style={styles.choiceButtonText}>Переснять</Text>
                    </Pressable>
                </View>
            )}

            {showFilters && (
                <View style={styles.filtersContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersContentContainer}
                    >
                        {FILTERS.map((filter) => (
                            <Pressable
                                key={filter.name}
                                style={styles.filter}
                                onPress={() => setSelectedFilter(filter)}
                            >
                                <Text style={styles.filterText}>
                                    {filter.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryButton: {
        flexDirection: 'row',
        backgroundColor: '#555',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    galleryButtonText: { color: '#fff', marginLeft: 10, fontSize: 18 },
    imageContainer: {
        flex: 1,
        width: '100%',
    },
    topButtonsContainer: {
        position: 'absolute',
        top: 40,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        zIndex: 10,
    },
    iconButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 12,
        borderRadius: 50,
    },
    confirmationContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    choiceButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    choiceButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    filtersContainer: {
        height: 120,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 10,
    },
    filtersContentContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    filter: {
        padding: 20,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: { color: 'white', fontSize: 14 },
})
