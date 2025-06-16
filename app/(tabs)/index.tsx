import { useRouter } from 'expo-router'
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 40) / 2 - 10

const cardsData = [
    {
        id: '1',
        title: 'Карточка 1',
        image: require('../../assets/images/card_1.jpg'),
    },
    {
        id: '2',
        title: 'Карточка 2',
        image: require('../../assets/images/card_2.jpg'),
    },
    {
        id: '3',
        title: 'Карточка 3',
        image: require('../../assets/images/card_3.jpg'),
    },
    {
        id: '4',
        title: 'Карточка 4',
        image: require('../../assets/images/card_4.jpg'),
    },
    {
        id: '5',
        title: 'Карточка 5',
        image: require('../../assets/images/card_5.jpg'),
    },
    {
        id: '6',
        title: 'Карточка 6',
        image: require('../../assets/images/card_6.jpg'),
    },
    {
        id: '7',
        title: 'Карточка 7',
        image: require('../../assets/images/card_7.jpg'),
    },
    {
        id: '8',
        title: 'Карточка 8',
        image: require('../../assets/images/card_8.jpg'),
    },
    {
        id: '9',
        title: 'Карточка 9',
        image: require('../../assets/images/card_9.jpg'),
    },
]

export default function HomeScreen() {
    const router = useRouter()

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/details/${item.id}`)}
            
        >
            <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
            />
            <Text style={styles.cardTitle}>{item.title}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={cardsData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 30,
        marginTop: 50,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardImage: {
        width: '100%',
        height: CARD_WIDTH * 0.8,
    },
    cardTitle: {
        padding: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})
