"use client"

import * as React from "react"
import { TimeInput, type TimeInputProps } from "@/components/ui/time-input"

function Fixture({ id, children, value }: { id: string; children: React.ReactNode; value: string }) {
  return (
    <section data-testid={id} className="flex items-center gap-3">
      <input aria-label="before" className="border px-2" />
      {children}
      <input aria-label="after" className="border px-2" />
      <output data-testid="value">{value}</output>
    </section>
  )
}

function Uncontrolled({ id, ...props }: { id: string } & TimeInputProps) {
  const [value, setValue] = React.useState(props.defaultValue ?? "")
  return (
    <Fixture id={id} value={value}>
      <TimeInput {...props} onChange={setValue} />
    </Fixture>
  )
}

function Controlled() {
  const [value, setValue] = React.useState("09:30")
  return (
    <Fixture id="controlled" value={value}>
      <TimeInput value={value} onChange={setValue} />
    </Fixture>
  )
}

// Commits on blur and remounts via `key` — a pattern that loses focus if the
// component fires onBlur while focus moves between its own segments.
function RemountOnBlur() {
  const [committed, setCommitted] = React.useState("09:30")
  return (
    <Fixture id="remount" value={committed}>
      <TimeInput key={committed} defaultValue={committed} onBlur={setCommitted} />
    </Fixture>
  )
}

export function Fixtures() {
  return (
    <main className="flex flex-col gap-6 p-8">
      <Uncontrolled id="h24" defaultValue="09:30" />
      <Uncontrolled id="empty" />
      <Uncontrolled id="seconds" defaultValue="09:30:15" showSeconds />
      <Uncontrolled id="h12" defaultValue="09:30" format="12h" />
      <Controlled />
      <RemountOnBlur />
    </main>
  )
}
