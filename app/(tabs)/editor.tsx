import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import ViewShot from 'react-native-view-shot'

interface FilterConfig {
    name: string
    description: string
    imageStyle: {
        filter?: string
    }
}

const FILTERS: FilterConfig[] = [
    {
        name: 'Оригинал',
        description: 'Полностью цветное и четкое изображение.',
        imageStyle: {},
    },
    {
        name: 'Новорожденный',
        description:
            'Мир в пятнах. Зрение очень размытое, почти без цветов. Фокусировка на расстоянии 20-30 см.',
        imageStyle: {
            filter: 'blur(30px) grayscale(1) contrast(1.2)',
        },
    },
    {
        name: '1 месяц',
        description:
            'Начинает видеть яркие предметы. Появляется первый цвет — красный.',
        imageStyle: {
            filter: 'blur(25px) grayscale(0.9) sepia(0.3) hue-rotate(-20deg)',
        },
    },
    {
        name: '2 месяца',
        description:
            'Начинает следить за предметами. Различает красный и зеленый цвета.',
        imageStyle: {
            filter: 'blur(15px) grayscale(0.7) contrast(1.1)',
        },
    },
    {
        name: '3 месяца',
        description:
            'Распознает черты лица, появляется объемное зрение. Различает желтый цвет.',
        imageStyle: {
            filter: 'blur(10px) grayscale(0.5) contrast(1.1)',
        },
    },
    {
        name: '4 месяца',
        description:
            'Мир становится еще красочнее! Малыш уже может отличить синий цвет.',
        imageStyle: {
            filter: 'blur(6px) grayscale(0.3)',
        },
    },
    {
        name: '6 месяцев',
        description:
            'Хорошая четкость. Различает формы, размеры и даже фактуру предметов.',
        imageStyle: {
            filter: 'blur(3px) grayscale(0.1)',
        },
    },
    {
        name: '1 год',
        description:
            'Зрение четкое и ясное, как у взрослого. Мир во всех красках!',
        imageStyle: {
            filter: 'none',
        },
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
                        <MaterialIcons name="save" size={24} color="white" />
                    </Pressable>
                )}
                <Pressable style={styles.iconButton} onPress={handleClear}>
                    <MaterialIcons name="delete" size={24} color="white" />
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
