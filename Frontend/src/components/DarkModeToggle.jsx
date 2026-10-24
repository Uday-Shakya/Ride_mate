import React from 'react'
import { useTheme } from '../context/ThemeContext'

const DarkModeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative inline-flex items-center cursor-pointer select-none focus:outline-none group ${className}`}
      aria-label="Toggle dark mode"
    >
      {/* Track */}
      <div
        className={`w-14 h-7 rounded-full transition-all duration-300 ease-in-out shadow-inner relative
          ${isDark
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-violet-500/40'
            : 'bg-gradient-to-r from-amber-300 to-orange-400 shadow-amber-400/40'
          }`}
      >
        {/* Stars (dark) / Rays (light) decorations */}
        <span
          className={`absolute inset-0 flex items-center transition-opacity duration-300
            ${isDark ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full" />
          <span className="absolute top-2.5 left-4 w-1 h-1 bg-white/70 rounded-full" />
          <span className="absolute bottom-1.5 left-2.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
        </span>

        {/* Thumb (sun/moon icon) */}
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center
            transition-all duration-300 ease-in-out transform
            ${isDark
              ? 'translate-x-7 bg-slate-800 shadow-slate-900/60'
              : 'translate-x-0 bg-white shadow-orange-200/60'
            }`}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-violet-200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

export default DarkModeToggle
