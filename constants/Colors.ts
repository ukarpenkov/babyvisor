import { Themes } from './theme'

export const Colors = {
    light: {
        text: Themes.light.colors.onSurface,
        background: Themes.light.colors.background,
        tint: Themes.light.colors.primary,
        icon: Themes.light.colors.onSurfaceVariant,
        tabIconDefault: Themes.light.colors.onSurfaceVariant,
        tabIconSelected: Themes.light.colors.primary,
    },
    dark: {
        text: Themes.dark.colors.onSurface,
        background: Themes.dark.colors.background,
        tint: Themes.dark.colors.primary,
        icon: Themes.dark.colors.onSurfaceVariant,
        tabIconDefault: Themes.dark.colors.onSurfaceVariant,
        tabIconSelected: Themes.dark.colors.primary,
    },
}
