import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'

const cardData = {
    '1': {
        title: 'Карточка 1',
        image: require('../../assets/images/card_1.jpg'),
        description: 'Описание карточки 1',
    },
    '2': {
        title: 'Карточка 2',
        image: require('../../assets/images/card_2.jpg'),
        description: 'Описание карточки 2',
    },
    '3': {
        title: 'Карточка 3',
        image: require('../../assets/images/card_3.jpg'),
        description: 'Описание карточки 3',
    },
    '4': {
        title: 'Карточка 4',
        image: require('../../assets/images/card_4.jpg'),
        description: 'Описание карточки 4',
    },
    '5': {
        title: 'Карточка 5',
        image: require('../../assets/images/card_5.jpg'),
        description: 'Описание карточки 5',
    },
    '6': {
        title: 'Карточка 6',
        image: require('../../assets/images/card_6.jpg'),
        description: 'Описание карточки 6',
    },
    '7': {
        title: 'Карточка 7',
        image: require('../../assets/images/card_7.jpg'),
        description: 'Описание карточки 7',
    },
    '8': {
        title: 'Карточка 8',
        image: require('../../assets/images/card_8.jpg'),
        description: 'Описание карточки 8',
    },
    '9': {
        title: 'Карточка 9',
        image: require('../../assets/images/card_9.jpg'),
        description: 'Описание карточки 9',
    },
}

export default function CardDetails() {
    const { id } = useLocalSearchParams()
    const card = cardData[Array.isArray(id) ? id[0] : id] || cardData['1']
    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
        })
    }, [navigation])
    return (
        <ScrollView style={styles.container}>
            <Image
                source={card.image}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.content}>
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.description}>{card.description}</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
})
