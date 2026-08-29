import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ViewShot from 'react-native-view-shot'
import { WebView } from 'react-native-webview'
import { EmptyState } from '../../components/ui/EmptyState'
import { MaterialButton } from '../../components/ui/MaterialButton'
import { AppTheme } from '../../constants/theme'
import { useAppTheme } from '../../hooks/useAppTheme'

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
    const theme = useAppTheme()
    const insets = useSafeAreaInsets()
    const styles = useMemo(() => createStyles(theme), [theme])

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
        if (isLoading) {
            return (
                <View style={[styles.centered, { paddingTop: insets.top }]}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </View>
            )
        }

        return (
            <View
                style={[
                    styles.emptyWrap,
                    { paddingTop: insets.top },
                ]}
            >
                <EmptyState
                    icon="image"
                    title="Выберите фото"
                    message="Загрузите снимок из галереи, чтобы посмотреть его глазами ребёнка."
                >
                    <MaterialButton
                        title="Открыть галерею"
                        icon="photo-library"
                        onPress={pickImageAsync}
                    />
                </EmptyState>
            </View>
        )
    }

    return (
        <View style={styles.viewer}>
            <StatusBar style="light" />
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
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

            <View
                style={[
                    styles.topButtonsContainer,
                    { top: insets.top + 8 },
                ]}
            >
                {selectedFilter.name !== 'Оригинал' && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                        onPress={saveImage}
                        android_ripple={{ color: theme.colors.ripple }}
                        accessibilityLabel="Сохранить"
                    >
                        <MaterialIcons
                            name="save-alt"
                            size={22}
                            color={theme.colors.onSurface}
                        />
                    </Pressable>
                )}
                <Pressable
                    style={({ pressed }) => [
                        styles.iconButton,
                        pressed && styles.iconButtonPressed,
                    ]}
                    onPress={handleClear}
                    android_ripple={{ color: theme.colors.ripple }}
                    accessibilityLabel="Удалить"
                >
                    <MaterialIcons
                        name="delete-outline"
                        size={22}
                        color={theme.colors.onSurface}
                    />
                </Pressable>
            </View>

            {showConfirmation && (
                <View style={[styles.sheet, { paddingBottom: 16 }]}>
                    <Text style={styles.sheetTitle}>Использовать это фото?</Text>
                    <View style={styles.sheetActions}>
                        <MaterialButton
                            title="Переснять"
                            variant="outlined"
                            icon="replay"
                            onPress={handleRetake}
                            style={styles.sheetButton}
                        />
                        <MaterialButton
                            title="Далее"
                            icon="check"
                            onPress={handleConfirm}
                            style={styles.sheetButton}
                        />
                    </View>
                </View>
            )}

            {showFilters && (
                <View style={[styles.sheet, { paddingBottom: 12 }]}>
                    <Text style={styles.sheetTitle}>Этап зрения</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersContent}
                    >
                        {FILTERS.map((filter) => {
                            const selected =
                                selectedFilter.name === filter.name
                            return (
                                <Pressable
                                    key={filter.name}
                                    onPress={() => setSelectedFilter(filter)}
                                    android_ripple={{
                                        color: theme.colors.ripple,
                                    }}
                                    style={[
                                        styles.chip,
                                        selected
                                            ? styles.chipSelected
                                            : styles.chipIdle,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selected
                                                ? styles.chipTextSelected
                                                : styles.chipTextIdle,
                                        ]}
                                    >
                                        {filter.name}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </View>
            )}
        </View>
    )
}

function createStyles(theme: AppTheme) {
    const { colors, radii, space } = theme

    return StyleSheet.create({
        centered: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        emptyWrap: {
            flex: 1,
            backgroundColor: colors.background,
        },
        viewer: {
            flex: 1,
            backgroundColor: '#000000',
        },
        loaderContainer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.scrim,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
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
            right: space.lg,
            flexDirection: 'row',
            gap: space.sm,
            zIndex: 10,
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surfaceContainerHigh,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
        },
        iconButtonPressed: {
            opacity: 0.85,
        },
        sheet: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.surfaceContainer,
            borderTopLeftRadius: radii.lg,
            borderTopRightRadius: radii.lg,
            paddingTop: space.md,
            paddingHorizontal: space.lg,
        },
        sheetTitle: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.onSurfaceVariant,
            marginBottom: space.md,
        },
        sheetActions: {
            flexDirection: 'row',
            gap: space.md,
        },
        sheetButton: {
            flex: 1,
        },
        filtersContent: {
            alignItems: 'center',
            paddingBottom: space.sm,
            gap: space.sm,
        },
        chip: {
            height: 32,
            paddingHorizontal: 16,
            borderRadius: radii.sm,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 0,
        },
        chipIdle: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.outline,
        },
        chipSelected: {
            backgroundColor: colors.secondaryContainer,
            borderWidth: 0,
        },
        chipText: {
            fontSize: 14,
            fontWeight: '500',
        },
        chipTextIdle: {
            color: colors.onSurfaceVariant,
        },
        chipTextSelected: {
            color: colors.onSecondaryContainer,
        },
    })
}
