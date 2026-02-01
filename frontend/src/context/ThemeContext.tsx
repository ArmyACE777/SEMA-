'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { colorPalette, bluePalette, redPalette } from '../lib/colors'

interface ThemeContextType {
  colors: typeof colorPalette
  currentTheme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('green')
  const [colors, setColors] = useState(colorPalette)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setCurrentTheme(saved)
      // Swap palettes based on saved theme
      if (saved === 'blue') setColors(bluePalette as typeof colorPalette)
      if (saved === 'red') setColors(redPalette as typeof colorPalette)
      if (saved === 'green') setColors(colorPalette)
    }
    setMounted(true)
  }, [])

  const handleSetTheme = (theme: string) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    
    if (theme === 'blue') setColors(bluePalette as typeof colorPalette)
    if (theme === 'red') setColors(redPalette as typeof colorPalette)
    if (theme === 'green') setColors(colorPalette)
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ colors, currentTheme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
