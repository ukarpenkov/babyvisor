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

const FILTERS = [
    {
        name: 'Оригинал',
        description: 'Полностью цветное и четкое изображение.',
        imageStyle: {},
    },
    {
        name: 'Новорожденный',
        description: 'Мир в пятнах...',
        imageStyle: { filter: 'blur(30px) grayscale(1) contrast(1.2)' },
    },
    {
        name: '1 месяц',
        description: 'Видит красный...',
        imageStyle: {
            filter: 'blur(25px) grayscale(0.9) sepia(0.3) hue-rotate(-20deg)',
        },
    },
    {
        name: '2 месяца',
        description: 'Следит за предметами...',
        imageStyle: { filter: 'blur(15px) grayscale(0.7) contrast(1.1)' },
    },
    {
        name: '3 месяца',
        description: 'Распознаёт черты лица...',
        imageStyle: { filter: 'blur(10px) grayscale(0.5) contrast(1.1)' },
    },
    {
        name: '4 месяца',
        description: 'Видит синий цвет...',
        imageStyle: { filter: 'blur(6px) grayscale(0.3)' },
    },
    {
        name: '6 месяцев',
        description: 'Чёткое зрение...',
        imageStyle: { filter: 'blur(3px) grayscale(0.1)' },
    },
    {
        name: '1 год',
        description: 'Зрение как у взрослого...',
        imageStyle: { filter: 'none' },
    },
]

export default function EditorScreen() {
    const params = useLocalSearchParams()
    const router = useRouter()

    const viewShotRef = useRef<ViewShot>(null)
    const webViewRef = useRef<WebView>(null)

    const [base64Image, setBase64Image] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState(FILTERS[0])
    const [isLoading, setIsLoading] = useState(false)
    const [mediaLibraryPermission, requestMediaLibraryPermission] =
        MediaLibrary.usePermissions()

    useEffect(() => {
        const processParams = async () => {
            const uri = params.imageUri as string | undefined
            const confirmation = params.showConfirmation === 'true'

            setIsLoading(true)
            try {
                if (uri) {
                    const info = await FileSystem.getInfoAsync(uri)
                    if (!info.exists) throw new Error('Файл не найден')

                    const base64 = await FileSystem.readAsStringAsync(uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    })

                    setBase64Image(`data:image/jpeg;base64,${base64}`)
                    setShowConfirmation(confirmation)
                    setShowFilters(!confirmation)
                } else {
                    setBase64Image(null)
                    setShowConfirmation(false)
                    setShowFilters(false)
                }
            } catch (error) {
                console.error('Ошибка загрузки изображения:', error)
                Alert.alert('Ошибка', 'Не удалось загрузить изображение')
            } finally {
                setIsLoading(false)
                setSelectedFilter(FILTERS[0])
            }
        }

        processParams()
    }, [params.imageUri, params.showConfirmation])

    useEffect(() => {
        if (!mediaLibraryPermission) requestMediaLibraryPermission()
    }, [mediaLibraryPermission])

    const pickImageAsync = async () => {
        setIsLoading(true)
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                quality: 1,
                base64: true,
            })
            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0]
                const mime = asset.mimeType || 'image/jpeg'
                setBase64Image(`data:${mime};base64,${asset.base64}`)
                setShowConfirmation(false)
                setShowFilters(true)
                setSelectedFilter(FILTERS[0])
            }
        } catch (e) {
            Alert.alert('Ошибка', 'Не удалось выбрать изображение')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setBase64Image(null)
        setShowConfirmation(false)
        setShowFilters(false)
        setSelectedFilter(FILTERS[0])
        router.replace('/editor')
    }

    const handleRetake = () => {
        router.navigate('/camera')
    }

    const handleConfirm = () => {
        setShowConfirmation(false)
        setShowFilters(true)
    }

    const saveImage = async () => {
        if (!viewShotRef.current) return

        if (!mediaLibraryPermission?.granted) {
            Alert.alert(
                'Нет разрешения',
                'Разрешите доступ к галерее, чтобы сохранить фото.'
            )
            return
        }

        try {
            setIsLoading(true)
            const uri = await viewShotRef.current.capture()
            await MediaLibrary.saveToLibraryAsync(uri)
            Alert.alert('Успешно', 'Фото сохранено в галерею.')
        } catch (e) {
            Alert.alert('Ошибка', 'Не удалось сохранить изображение.')
        } finally {
            setIsLoading(false)
        }
    }

    const getHtmlContent = () => {
        const filterStyle = selectedFilter.imageStyle.filter || 'none'
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body, html {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    background-color: black;
                    overflow: hidden;
                }
                .image-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
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
            <div class="image-container">
                <img src="${base64Image}" />
            </div>
        </body>
        </html>
        `
    }

    if (!base64Image) {
        return (
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <Pressable
                        style={styles.galleryButton}
                        onPress={pickImageAsync}
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
                    <ActivityIndicator size="large" color="#fff" />
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
                    scrollEnabled={false}
                    javaScriptEnabled
                    domStorageEnabled
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => {
                        console.error('WebView error:', e.nativeEvent)
                        Alert.alert('Ошибка', 'Не удалось отобразить фото.')
                    }}
                />
            </ViewShot>

            <View style={styles.topButtonsContainer}>
                {selectedFilter.name !== 'Оригинал' && (
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
                        style={({ pressed }) => [
                            styles.materialButton,
                            { backgroundColor: '#4CAF50' },
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.materialButtonText}>Ок 👍</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.materialButton,
                            { backgroundColor: '#E53935' },
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleRetake}
                    >
                        <Text style={styles.materialButtonText}>
                            Переснять 🔄
                        </Text>
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
        width: '100%',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    choiceButton: {
        flex: 1,
        padding: 15,
        marginHorizontal: 10,
        borderRadius: 8,
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
        borderColor: 'white',
        borderWidth: 1,
    },
    filterText: {
        color: 'white',
        fontSize: 14,
    },
    choiceButtonModern: {
        flex: 1,
        paddingVertical: 14,
        marginHorizontal: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },

    choiceButtonModernText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    materialButton: {
        flex: 1,
        paddingVertical: 16,
        marginHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    buttonPressed: {
        opacity: 0.85,
    },

    materialButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
})
