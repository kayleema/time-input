import type { Metadata } from "next"
import { PageContent } from "./page-content"

export const metadata: Metadata = {
  title: "time-input - shadcn-compatible time input",
  description:
    "A flexible time input for shadcn/ui projects. Supports 24h and 12h formats, AM/PM toggle, optional seconds, and auto zero-padding on blur — everything the native type=\"time\" can't do.",
}

export default function Page() {
  return <PageContent />
}
