import { notFound } from "next/navigation"
import { Fixtures } from "./fixtures"

// Test-only page driven by the Playwright suite in /e2e. Not served in production builds.
export default function E2EPage() {
  if (process.env.NODE_ENV === "production") notFound()
  return <Fixtures />
}
