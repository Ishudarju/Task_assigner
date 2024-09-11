"use client"

import { Sun,Moon } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
const Header = () => {
    const { theme, setTheme } = useTheme();
  return (
    <div>
        <Button variant="primary" size="icon" aria-label="Toggle Theme" className="ml-1" onClick={()=>setTheme(theme=="dark"?"light":"dark")}>
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
            <span className="sr-only">Toggle Theme</span>
        </Button>
    </div>
  )
}

export default Header
