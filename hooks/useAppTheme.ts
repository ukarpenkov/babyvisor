import { Themes, type AppTheme } from '../constants/theme'
import { useColorScheme } from './useColorScheme'

export function useAppTheme(): AppTheme {
    const scheme = useColorScheme() ?? 'light'
    return Themes[scheme]
}
