import * as MediaLibrary from 'expo-media-library'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Button, Image, Platform, StyleSheet, View } from 'react-native'

type PreviewScreenParams = {
    uri: string
}

const PreviewScreen: React.FC = () => {
    // Используем дженерик для строгой типизации параметров
    const params = useLocalSearchParams<PreviewScreenParams>()
    const router = useRouter()
    const [status, requestPermission] = MediaLibrary.usePermissions()

    const savePhoto = async () => {
        // Убедимся, что URI существует, прежде чем сохранять
        if (!params.uri) return

        // Запрашиваем разрешение, если оно не было предоставлено
        if (status && !status.granted) {
            const permission = await requestPermission()
            if (!permission.granted) {
                Alert.alert(
                    'Ошибка',
                    'Необходимо разрешение для сохранения фото.'
                )
                return
            }
        }

        try {
            await MediaLibrary.saveToLibraryAsync(params.uri)
            Alert.alert('Сохранено!', 'Фотография успешно сохранена в галерее.')
            router.back()
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сохранить фотографию.')
            console.error(error)
        }
    }

    return (
        <View style={styles.container}>
            {params.uri && (
                <Image source={{ uri: params.uri }} style={styles.image} />
            )}
            <View style={styles.buttonContainer}>
                <Button title="Переснять" onPress={() => router.back()} />
                <Button title="ОК" onPress={savePhoto} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    image: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        padding: 20,
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
    },
})

export default PreviewScreen
