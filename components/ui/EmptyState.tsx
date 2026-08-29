import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ComponentProps, ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAppTheme } from '../../hooks/useAppTheme'

type EmptyStateProps = {
    icon: ComponentProps<typeof MaterialIcons>['name']
    title: string
    message: string
    children?: ReactNode
}

export function EmptyState({
    icon,
    title,
    message,
    children,
}: EmptyStateProps) {
    const theme = useAppTheme()

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <View
                style={[
                    styles.iconWrap,
                    { backgroundColor: theme.colors.primaryContainer },
                ]}
            >
                <MaterialIcons
                    name={icon}
                    size={36}
                    color={theme.colors.onPrimaryContainer}
                />
            </View>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.message,
                    { color: theme.colors.onSurfaceVariant },
                ]}
            >
                {message}
            </Text>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 320,
    },
})
