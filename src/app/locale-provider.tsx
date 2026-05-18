"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { strings, type Locale } from "./i18n"

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en")

  React.useEffect(() => {
    const stored = localStorage.getItem("time-input-locale")
    if (stored === "en" || stored === "ja") {
      setLocaleState(stored)
    } else if (navigator.language.toLowerCase().startsWith("ja")) {
      setLocaleState("ja")
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = strings[locale].htmlLang
  }, [locale])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem("time-input-locale", l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return React.useContext(LocaleContext)
}

export function LocaleToggle() {
  const { locale, setLocale } = useLocale()
  const s = strings[locale]

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
      {(["en", "ja"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            "rounded px-2 py-0.5 text-xs font-medium transition-colors",
            locale === l
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {l === "en" ? s.langEn : s.langJa}
        </button>
      ))}
    </div>
  )
}
