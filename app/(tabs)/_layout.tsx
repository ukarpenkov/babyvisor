import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'black' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Информацмия',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <MaterialIcons name="info" size={24} color="black" />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Камера',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <MaterialIcons
                            name="camera-enhance"
                            size={24}
                            color="black"
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="editor"
                options={{
                    title: 'Редактор',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <MaterialIcons name="create" size={24} color="black" />
                    ),
                }}
            />
        </Tabs>
    )
}
