import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useAppTheme } from '../hooks/useAppTheme'
import { useColorScheme } from '../hooks/useColorScheme'

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const theme = useAppTheme()
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })

    if (!loaded) {
        return null
    }

    const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme

    return (
        <ThemeProvider
            value={{
                ...navigationTheme,
                colors: {
                    ...navigationTheme.colors,
                    primary: theme.colors.primary,
                    background: theme.colors.background,
                    card: theme.colors.surfaceContainer,
                    text: theme.colors.onSurface,
                    border: theme.colors.outlineVariant,
                    notification: theme.colors.error,
                },
            }}
        >
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    )
}
