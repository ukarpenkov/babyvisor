import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import React from 'react'
import { useColorScheme } from 'react-native'

export default function TabLayout() {
    const colorScheme = useColorScheme()
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor:
                    colorScheme === 'dark' ? 'white' : 'black', 
                tabBarInactiveTintColor: 'gray', // если не выбран
                tabBarStyle: {
                    backgroundColor:
                        colorScheme === 'dark' ? '#121212' : '#f5f5f5', 
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Информацмия',
                    tabBarIcon: () => (
                        <MaterialIcons
                            name="info"
                            size={24}
                            color={colorScheme === 'dark' ? 'white' : 'dark'}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Камера',
                    tabBarIcon: () => (
                        <MaterialIcons
                            name="camera-enhance"
                            size={24}
                            color={colorScheme === 'dark' ? 'white' : 'dark'}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="editor"
                options={{
                    title: 'Редактор',
                    tabBarIcon: () => (
                        <MaterialIcons
                            name="create"
                            size={24}
                            color={colorScheme === 'dark' ? 'white' : 'dark'}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}
