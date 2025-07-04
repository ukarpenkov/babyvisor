// app/(tabs)/index.tsx
import React, { PropsWithChildren, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

// Типизируем props для нашего компонента
interface CollapsibleSectionProps {
    title: string
}

const CollapsibleSection: React.FC<
    PropsWithChildren<CollapsibleSectionProps>
> = ({ title, children }) => {
    // Типизируем state
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

    return (
        <View style={styles.sectionContainer}>
            <Pressable
                onPress={() => setIsCollapsed(!isCollapsed)}
                style={styles.header}
            >
                <Text style={styles.headerText}>{title}</Text>
                <Text style={styles.icon}>{isCollapsed ? '+' : '-'}</Text>
            </Pressable>
            {!isCollapsed && <View style={styles.content}>{children}</View>}
        </View>
    )
}

export default function AboutScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Информация о приложении</Text>

            <CollapsibleSection title="О приложении">
                <Text style={styles.paragraph}>
                    Это демонстрационное приложение, созданное с помощью Expo
                    Router. Оно показывает работу с камерой, галереей и простое
                    редактирование изображений.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="Как пользоваться">
                <Text style={styles.paragraph}>
                    1. Перейдите на вкладкусделать снимок. 2. сможете выбрать
                    фото из галереи.
                </Text>
            </CollapsibleSection>

            <CollapsibleSection title="Технологии">
                <Text style={styles.paragraph}>
                    - React Native & Expo - Expo Router - Expo Camera - Expo
                    Media Library - Expo Image Picker
                </Text>
            </CollapsibleSection>
        </ScrollView>
    )
}

// Стили остаются такими же
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e9e9e9',
    },
    headerText: { fontSize: 18, fontWeight: '500' },
    icon: { fontSize: 22, fontWeight: 'bold' },
    content: { padding: 16, borderTopWidth: 1, borderTopColor: '#ddd' },
    paragraph: { fontSize: 16, lineHeight: 24 },
})
