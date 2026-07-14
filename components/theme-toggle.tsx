"use client"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ThemeToggleProps = {
  menuAlign?: "start" | "center" | "end"
  menuSide?: "top" | "right" | "bottom" | "left"
}

export function ThemeToggle({ menuAlign = "end", menuSide = "bottom" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative text-foreground" aria-label="Choose color theme">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          <span className="sr-only">Choose color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={menuAlign}
        side={menuSide}
        sideOffset={8}
        collisionPadding={12}
        className="z-[120] w-44 rounded-xl p-2 shadow-lg"
      >
        <DropdownMenuLabel className="px-2 pb-2 pt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="rounded-lg data-[state=checked]:bg-primary/10">
            <Sun aria-hidden="true" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="rounded-lg data-[state=checked]:bg-primary/10">
            <Moon aria-hidden="true" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="rounded-lg data-[state=checked]:bg-primary/10">
            <Monitor aria-hidden="true" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
