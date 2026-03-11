'use client'

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Évite les erreurs de rendu côté serveur
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-bordeaux-800 dark:hover:bg-gray-800 transition-colors group"
      title="Changer le thème"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-bordeaux-200 group-hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-bordeaux-200 group-hover:text-white transition-colors" />
      )}
    </button>
  )
}