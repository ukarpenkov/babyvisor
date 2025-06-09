import { Tabs } from 'expo-router'
import React from 'react'

import CameraIcon from '../../assets/icons/CameraIcon'
import { IconSymbol } from '../../components/ui/IconSymbol'
import { useColorScheme } from '../../hooks/useColorScheme'

export default function TabLayout() {
    const colorScheme = useColorScheme()

    return (
        <Tabs
        // screenOptions={{
        //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        //     headerShown: false,
        //     tabBarButton: HapticTab,
        //     tabBarBackground: TabBarBackground,
        //     tabBarStyle: Platform.select({
        //         ios: {
        //             // Use a transparent background on iOS to show the blur effect
        //             position: 'absolute',
        //         },
        //         default: {},
        //     }),
        // }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <CameraIcon />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="paperplane.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}
