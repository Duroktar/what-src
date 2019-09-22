import { theme as dark } from './theme.dark'
import { theme as light } from './theme.light'

export type Theme = typeof dark | typeof light;
export type ThemeName = 'dark' | 'light';

export const presets: Record<ThemeName, any> = {
  dark,
  light,
}

export const themes: ThemeName[] = [
  'dark',
  'light',
]
