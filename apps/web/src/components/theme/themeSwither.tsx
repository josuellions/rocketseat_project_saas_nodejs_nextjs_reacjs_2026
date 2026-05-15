'use client'

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function ThemeSwither () {
  const { setTheme, theme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" >
          <Sun className={theme === "light" ? "size-4": "hidden"} />
          <Moon className={theme !== "light" ? "size-4": "hidden"}/>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}