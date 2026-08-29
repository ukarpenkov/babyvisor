import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { ComponentProps } from 'react'
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native'
import { ThemeColors } from '../../constants/theme'
import { useAppTheme } from '../../hooks/useAppTheme'

type Variant = 'filled' | 'outlined' | 'tonal' | 'text'

type MaterialButtonProps = {
    title: string
    onPress: () => void
    variant?: Variant
    icon?: ComponentProps<typeof MaterialIcons>['name']
    disabled?: boolean
    loading?: boolean
    style?: StyleProp<ViewStyle>
}

export function MaterialButton({
    title,
    onPress,
    variant = 'filled',
    icon,
    disabled,
    loading,
    style,
}: MaterialButtonProps) {
    const theme = useAppTheme()
    const palette = variantColors(theme.colors, variant)
    const isDisabled = disabled || loading

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            android_ripple={{ color: theme.colors.ripple }}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: palette.background,
                    borderColor: palette.border,
                    borderWidth: variant === 'outlined' ? 1 : 0,
                    opacity: isDisabled ? 0.38 : pressed ? 0.92 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={palette.foreground} />
            ) : (
                <View style={styles.row}>
                    {icon ? (
                        <MaterialIcons
                            name={icon}
                            size={18}
                            color={palette.foreground}
                        />
                    ) : null}
                    <Text style={[styles.label, { color: palette.foreground }]}>
                        {title}
                    </Text>
                </View>
            )}
        </Pressable>
    )
}

function variantColors(colors: ThemeColors, variant: Variant) {
    switch (variant) {
        case 'outlined':
            return {
                background: 'transparent',
                foreground: colors.primary,
                border: colors.outline,
            }
        case 'tonal':
            return {
                background: colors.secondaryContainer,
                foreground: colors.onSecondaryContainer,
                border: 'transparent',
            }
        case 'text':
            return {
                background: 'transparent',
                foreground: colors.primary,
                border: 'transparent',
            }
        default:
            return {
                background: colors.primary,
                foreground: colors.onPrimary,
                border: 'transparent',
            }
    }
}

const styles = StyleSheet.create({
    base: {
        minHeight: 40,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
    },
})
