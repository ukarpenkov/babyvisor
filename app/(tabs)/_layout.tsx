// app/(tabs)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Информацмия',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <FontAwesome size={24} name="file-text" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Камера',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <FontAwesome size={24} name="camera" color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="editor"
                options={{
                    title: 'Редактор',
                    tabBarIcon: ({ color }: { color: string }) => (
                        <FontAwesome size={28} name="edit" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
