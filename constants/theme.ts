const radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 28,
    full: 999,
} as const

const space = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
} as const

const lightColors = {
    primary: '#1D6B7A',
    onPrimary: '#FFFFFF',
    primaryContainer: '#B8EAF4',
    onPrimaryContainer: '#002022',
    secondaryContainer: '#CCE8EA',
    onSecondaryContainer: '#051F21',
    background: '#F7F9FA',
    surface: '#F7F9FA',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F1F4F5',
    surfaceContainer: '#ECEEEF',
    surfaceContainerHigh: '#E6E8E9',
    onSurface: '#191C1D',
    onSurfaceVariant: '#3F494B',
    outline: '#6F797B',
    outlineVariant: '#BFC8CA',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    ripple: 'rgba(29, 107, 122, 0.12)',
    scrim: 'rgba(0, 0, 0, 0.45)',
}

const darkColors = {
    primary: '#8CD0DE',
    onPrimary: '#00363F',
    primaryContainer: '#004E5A',
    onPrimaryContainer: '#B8EAF4',
    secondaryContainer: '#324B4D',
    onSecondaryContainer: '#CCE8EA',
    background: '#111415',
    surface: '#111415',
    surfaceContainerLowest: '#0C0F10',
    surfaceContainerLow: '#191C1D',
    surfaceContainer: '#1D2021',
    surfaceContainerHigh: '#272A2B',
    onSurface: '#E1E3E4',
    onSurfaceVariant: '#BFC8CA',
    outline: '#899295',
    outlineVariant: '#3F494B',
    error: '#FFB4AB',
    onError: '#690005',
    ripple: 'rgba(140, 208, 222, 0.16)',
    scrim: 'rgba(0, 0, 0, 0.55)',
}

export type ThemeColors = typeof lightColors

export type AppTheme = {
    dark: boolean
    colors: ThemeColors
    radii: typeof radii
    space: typeof space
}

export const Themes: Record<'light' | 'dark', AppTheme> = {
    light: {
        dark: false,
        colors: lightColors,
        radii,
        space,
    },
    dark: {
        dark: true,
        colors: darkColors,
        radii,
        space,
    },
}
