import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import ViewShot from 'react-native-view-shot'
import { WebView } from 'react-native-webview'

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
    const params = useLocalSearchParams<{ base64?: string }>()
    const router = useRouter()
    const viewShotRef = useRef<ViewShot>(null)
    const webViewRef = useRef<WebView>(null)

    const [base64Image, setBase64Image] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [selectedFilter, setSelectedFilter] = useState<FilterConfig>(
        FILTERS[0]
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [mediaLibraryPermission, requestMediaLibraryPermission] =
        MediaLibrary.usePermissions()

    useEffect(() => {
        if (params.base64 && params.base64.startsWith('data:image')) {
            if (params.base64 !== base64Image) {
                setBase64Image(params.base64)
                setShowConfirmation(true) 
                setShowFilters(false)
                setSelectedFilter(FILTERS[0])
            }
        }
        else if (!params.base64) {
            setBase64Image(null)
            setShowConfirmation(false)
            setShowFilters(false)
            setSelectedFilter(FILTERS[0])
        }
    }, [params.base64]) 
    useEffect(() => {
        if (!mediaLibraryPermission) {
            requestMediaLibraryPermission()
        }
    }, [mediaLibraryPermission, requestMediaLibraryPermission])

    const pickImageAsync = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
                base64: true, 
            })
            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0]
                setShowConfirmation(false)
                setShowFilters(true)
                setSelectedFilter(FILTERS[0])

                if (asset.base64) {
                    const mimeType =
                        asset.mimeType ||
                        (asset.uri?.endsWith('.png')
                            ? 'image/png'
                            : 'image/jpeg') ||
                        'image/jpeg'
                    setBase64Image(`data:${mimeType};base64,${asset.base64}`)
                } else {
                    console.warn(
                        'Base64 not provided by ImagePicker, this should not happen.'
                    )
                    Alert.alert('Ошибка', 'Не удалось получить изображение')
                }
            }
        } catch (error) {
            console.error('Error picking image:', error)
            Alert.alert('Ошибка', 'Не удалось загрузить изображение')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setBase64Image(null)
        setShowConfirmation(false)
        setShowFilters(false)
        setSelectedFilter(FILTERS[0])
        router.setParams({ base64: undefined })
    }

    const handleRetake = (): void => {
        setBase64Image(null)
        router.setParams({ base64: undefined })
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
            setIsLoading(true)
            const localUri = await viewShotRef.current.capture()
            if (localUri) {
                await MediaLibrary.saveToLibraryAsync(localUri)
                Alert.alert('Сохранено!', 'Фото успешно сохранено в галерею.')
            }
        } catch (e) {
            console.error('Save image error:', e)
            Alert.alert('Ошибка', 'Не удалось сохранить фото.')
        } finally {
            setIsLoading(false)
        }
    }

    const getHtmlContent = () => {
        if (!base64Image)
            return '<!DOCTYPE html><html><head></head><body style="background-color:black;"></body></html>'
        const filterStyle = selectedFilter?.imageStyle?.filter || 'none'
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: black;
          }
          .image-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .filtered-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: ${filterStyle};
          }
        </style>
      </head>
      <body>
        <div class="image-container">
          <img src="${base64Image}" class="filtered-image" />
        </div>
      </body>
      </html>
    `
    }

    if (!base64Image) {
        return (
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                    <Pressable
                        style={styles.galleryButton}
                        onPress={pickImageAsync}
                        disabled={isLoading}
                    >
                        <FontAwesome name="image" size={24} color="white" />
                        <Text style={styles.galleryButtonText}>
                            Выбрать фото из галереи
                        </Text>
                    </Pressable>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
            <ViewShot
                ref={viewShotRef}
                options={{ format: 'jpg', quality: 0.9 }}
                style={styles.imageContainer}
            >
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: getHtmlContent() }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scrollEnabled={false}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent
                        console.error('WebView error:', nativeEvent)
                        setIsLoading(false)
                        Alert.alert(
                            'Ошибка',
                            'Не удалось загрузить изображение в WebView'
                        )
                    }}
                    onLoad={() => setIsLoading(false)} 
                />
            </ViewShot>
            <View style={styles.topButtonsContainer}>
                {selectedFilter && selectedFilter.name !== 'Оригинал' && (
                    <Pressable
                        style={styles.iconButton}
                        onPress={saveImage}
                        disabled={isLoading}
                    >
                        <MaterialIcons name="save" size={24} color="white" />
                    </Pressable>
                )}
                <Pressable
                    style={styles.iconButton}
                    onPress={handleClear}
                    disabled={isLoading}
                >
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
                        disabled={isLoading}
                    >
                        <Text style={styles.choiceButtonText}>Ок фото</Text>
                    </Pressable>
                    <Pressable
                        style={[
                            styles.choiceButton,
                            { backgroundColor: '#f44336' },
                        ]}
                        onPress={handleRetake}
                        disabled={isLoading}
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
                                style={[
                                    styles.filter,
                                    selectedFilter.name === filter.name &&
                                        styles.selectedFilter,
                                ]}
                                onPress={() => setSelectedFilter(filter)}
                                disabled={isLoading}
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
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    galleryButton: {
        flexDirection: 'row',
        backgroundColor: '#555',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    galleryButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 18,
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'black',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    placeholderText: {
        color: 'white',
        marginTop: 10,
        fontSize: 16,
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
    choiceButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
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
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
    },
    selectedFilter: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderColor: 'white',
    },
    filterText: {
        color: 'white',
        fontSize: 14,
    },
})
