'use client'
import { useTheme } from './ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <select
      className="theme-switcher fixed right-4 top-4 z-50 rounded border p-2 bg-white dark:bg-gray-800 dark:text-white"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="contrast">Contrast</option>
    </select>
  )
}
