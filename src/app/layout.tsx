import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "time-input - shadcn-compatible time input",
    template: "%s - time-input",
  },
  description:
    "A flexible time input for shadcn projects. Supports 24h/12h formats, AM/PM toggle, optional seconds, and auto zero-padding on blur.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
