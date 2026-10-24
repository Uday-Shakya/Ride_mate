import React, { createContext, useContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ridemate-theme')
    if (saved !== null) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('ridemate-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('ridemate-theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
