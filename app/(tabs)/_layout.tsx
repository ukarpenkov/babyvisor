import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Description',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Camera',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons
                            name="camera-enhance"
                            size={24}
                            color="black"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings" size={24} color="black" />
                    ),
                }}
            />
        </Tabs>
    )
}
