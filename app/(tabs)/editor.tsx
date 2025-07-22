import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as FileSystem from 'expo-file-system'
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
    { name: 'Оригинал', description: 'Без фильтров.', imageStyle: {} },
    {
        name: 'Новорожденный',
        description: 'Размытое, почти черно-белое зрение.',
        imageStyle: { filter: 'blur(30px) grayscale(1) contrast(1.2)' },
    },
    {
        name: '1 месяц',
        description: 'Первый цвет — красный.',
        imageStyle: {
            filter: 'blur(25px) grayscale(0.9) sepia(0.3) hue-rotate(-20deg)',
        },
    },
    {
        name: '2 месяца',
        description: 'Уже видит красный и зеленый.',
        imageStyle: { filter: 'blur(15px) grayscale(0.7) contrast(1.1)' },
    },
    {
        name: '3 месяца',
        description: 'Улучшение объема и цвета.',
        imageStyle: { filter: 'blur(10px) grayscale(0.5) contrast(1.1)' },
    },
    {
        name: '4 месяца',
        description: 'Различает синий цвет.',
        imageStyle: { filter: 'blur(6px) grayscale(0.3)' },
    },
    {
        name: '6 месяцев',
        description: 'Хорошая четкость и детализация.',
        imageStyle: { filter: 'blur(3px) grayscale(0.1)' },
    },
    {
        name: '1 год',
        description: 'Почти взрослое зрение.',
        imageStyle: { filter: 'none' },
    },
]

export default function EditorScreen() {
    const params = useLocalSearchParams()
    const router = useRouter()
    const viewShotRef = useRef<ViewShot>(null)
    const webViewRef = useRef<WebView>(null)

    const [imageUri, setImageUri] = useState<string | null>(null)
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
        const prepareImage = async (uri: string, base64?: string) => {
            setIsLoading(true)
            try {
                if (base64) {
                    setBase64Image(`data:image/jpeg;base64,${base64}`)
                } else {
                    const fileName = uri.split('/').pop()
                    const newPath = `${FileSystem.documentDirectory}${fileName}`
                    await FileSystem.copyAsync({ from: uri, to: newPath })
                    const fileInfo = await FileSystem.getInfoAsync(newPath)
                    if (!fileInfo.exists)
                        throw new Error('Файл не скопировался')
                    const base64 = await FileSystem.readAsStringAsync(newPath, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    setBase64Image(`data:image/jpeg;base64,${base64}`)
                }
            } catch (error) {
                console.error('Ошибка при подготовке изображения:', error)
                Alert.alert('Ошибка', 'Не удалось обработать изображение.')
            } finally {
                setIsLoading(false)
            }
        }

        if (params.imageUri && params.imageUri !== imageUri) {
            const uri = params.imageUri as string
            const base64 = params.base64 as string | undefined
            setImageUri(uri)
            setShowConfirmation(true)
            setShowFilters(false)
            prepareImage(uri, base64)
        }
    }, [params.imageUri, params.base64])

    useEffect(() => {
        if (!mediaLibraryPermission) {
            requestMediaLibraryPermission()
        }
    }, [])

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
                const uri = asset.uri
                setImageUri(uri)
                setShowConfirmation(false)
                setShowFilters(true)
                setSelectedFilter(FILTERS[0])

                if (asset.base64) {
                    setBase64Image(`data:image/jpeg;base64,${asset.base64}`)
                } else {
                    const base64 = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    })
                    setBase64Image(`data:image/jpeg;base64,${base64}`)
                }
            }
        } catch (error) {
            console.error('Ошибка выбора изображения:', error)
            Alert.alert('Ошибка', 'Не удалось загрузить изображение')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setImageUri(null)
        setBase64Image(null)
        setShowConfirmation(false)
        setShowFilters(false)
        setSelectedFilter(FILTERS[0])
        router.setParams({ imageUri: undefined })
    }

    const handleRetake = (): void => {
        setImageUri(null)
        setBase64Image(null)
        router.setParams({ imageUri: undefined })
        router.push('/camera')
    }

    const handleConfirm = (): void => {
        setShowConfirmation(false)
        setShowFilters(true)
    }

    const saveImage = async (): Promise<void> => {
        if (!mediaLibraryPermission?.granted) {
            Alert.alert('Нет доступа', 'Разрешите сохранение в галерею.')
            return
        }
        if (!viewShotRef.current) return

        try {
            setIsLoading(true)
            const localUri = await viewShotRef.current.capture()
            if (localUri) {
                await MediaLibrary.saveToLibraryAsync(localUri)
                Alert.alert('Сохранено', 'Фото сохранено в галерею.')
            }
        } catch (e) {
            console.error(e)
            Alert.alert('Ошибка', 'Не удалось сохранить изображение.')
        } finally {
            setIsLoading(false)
        }
    }

    const getHtmlContent = () => {
        if (!base64Image) return ''
        const filterStyle = selectedFilter?.imageStyle?.filter || 'none'

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        background: black;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                        filter: ${filterStyle};
                    }
                </style>
            </head>
            <body>
                <img src="${base64Image}" />
            </body>
            </html>
        `
    }

    if (!imageUri) {
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
                            Выбрать фото
                        </Text>
                    </Pressable>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isLoading || !base64Image ? (
                <View style={styles.imagePlaceholder}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.placeholderText}>
                        Подождите, изображение обрабатывается...
                    </Text>
                </View>
            ) : (
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
                        javaScriptEnabled
                        domStorageEnabled
                        scrollEnabled={false}
                        onError={() =>
                            Alert.alert(
                                'Ошибка',
                                'Не удалось отобразить изображение'
                            )
                        }
                    />
                </ViewShot>
            )}

            <View style={styles.topButtonsContainer}>
                {selectedFilter.name !== 'Оригинал' && (
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
        width: '100%',
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
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 10,
        width: '100%',
    },
    filter: {
        padding: 15,
        marginHorizontal: 5,
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
