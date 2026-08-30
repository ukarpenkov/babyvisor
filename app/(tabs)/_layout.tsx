import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Tabs } from 'expo-router'
import { ComponentProps } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HapticTab } from '../../components/HapticTab'
import { useAppTheme } from '../../hooks/useAppTheme'

function TabIcon({
    name,
    color,
    focused,
}: {
    name: ComponentProps<typeof MaterialIcons>['name']
    color: string
    focused: boolean
}) {
    const theme = useAppTheme()

    return (
        <View
            style={{
                width: 64,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused
                    ? theme.colors.secondaryContainer
                    : 'transparent',
            }}
        >
            <MaterialIcons name={name} size={24} color={color} />
        </View>
    )
}

export default function TabLayout() {
    const theme = useAppTheme()
    const insets = useSafeAreaInsets()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: {
                    backgroundColor: theme.colors.background,
                },
                tabBarActiveTintColor: theme.colors.onSecondaryContainer,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                tabBarButton: HapticTab,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
                tabBarItemStyle: {
                    paddingVertical: 0,
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.surfaceContainer,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 80 + insets.bottom,
                    paddingTop: 12,
                    paddingBottom: insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Информация',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="info" color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Камера',
                    unmountOnBlur: true,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            name="photo-camera"
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="editor"
                options={{
                    title: 'Редактор',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon name="tune" color={color} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    )
}
