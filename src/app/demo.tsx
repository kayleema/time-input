"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { TimeInput } from "@/components/ui/time-input"

export function InstallCommand({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false)
  const command = `npx shadcn@latest add ${url}`

  async function copy() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm">
      <span className="select-all text-muted-foreground">{command}</span>
      <button
        onClick={copy}
        className="ml-auto shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Copy install command"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}

export function InteractiveDemo() {
  const [value24, setValue24] = React.useState("14:05")
  const [value12, setValue12] = React.useState("14:30")
  const [valueSec, setValueSec] = React.useState("09:45:30")

  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <DemoCard label="24-hour" value={value24}>
        <TimeInput value={value24} onChange={setValue24} />
      </DemoCard>
      <DemoCard label="12-hour" value={value12}>
        <TimeInput format="12h" value={value12} onChange={setValue12} />
      </DemoCard>
      <DemoCard label="With seconds" value={valueSec}>
        <TimeInput showSeconds value={valueSec} onChange={setValueSec} />
      </DemoCard>
    </div>
  )
}

function DemoCard({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
      <p className="font-mono text-xs text-muted-foreground">
        value: <span className="text-foreground">{value || '""'}</span>
      </p>
    </div>
  )
}

export function VariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Row label="Default (24h)">
        <TimeInput defaultValue="09:00" />
      </Row>
      <Row label="12-hour">
        <TimeInput format="12h" defaultValue="09:00" />
      </Row>
      <Row label="With seconds">
        <TimeInput showSeconds defaultValue="09:00:00" />
      </Row>
      <Row label="12h + seconds">
        <TimeInput format="12h" showSeconds defaultValue="09:00:00" />
      </Row>
      <Row label="Custom placeholder">
        <TimeInput placeholder="--" />
      </Row>
      <Row label="Autofill minutes">
        <TimeInput autoFillMinutesOnBlur placeholder="--" />
      </Row>
      <Row label="Round nearest">
        <TimeInput roundMinutesToNearest={5} defaultValue="09:03" />
      </Row>
      <Row label="Round floor">
        <TimeInput
          roundMinutesToNearest={5}
          roundMinutesMode="floor"
          defaultValue="09:03"
        />
      </Row>
      <Row label="Round ceiling">
        <TimeInput
          roundMinutesToNearest={5}
          roundMinutesMode="ceil"
          defaultValue="09:03"
        />
      </Row>
      <Row label="Avoid day rollover">
        <TimeInput
          roundMinutesToNearest={5}
          roundLastIntervalDown
          defaultValue="23:58"
        />
      </Row>
      <Row label="Overflow hours (max 27)">
        <TimeInput allowOverflowHours maxOverflowHours={27} defaultValue="27:00" />
      </Row>
      <Row label="Allow 24:00 only">
        <TimeInput allowOverflowHours maxOverflowHours={24} defaultValue="24:00" />
      </Row>
      <Row label="Disabled">
        <TimeInput disabled defaultValue="14:05" />
      </Row>
    </div>
  )
}

export function LocaleDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Row label="en-US">
          <TimeInput format="12h" locale="en-US" defaultValue="14:05" />
        </Row>
        <Row label="zh-CN">
          <TimeInput format="12h" locale="zh-CN" defaultValue="14:05" />
        </Row>
        <Row label="ja-JP">
          <TimeInput format="12h" locale="ja-JP" defaultValue="14:05" />
        </Row>
        <Row label="ko-KR">
          <TimeInput format="12h" locale="ko-KR" defaultValue="14:05" />
        </Row>
        <Row label="ar-SA">
          <TimeInput format="12h" locale="ar-SA" defaultValue="14:05" />
        </Row>
        <Row label="periodLabels">
          <TimeInput
            format="12h"
            periodLabels={{ am: "vorm.", pm: "nachm." }}
            defaultValue="14:05"
          />
        </Row>
      </div>
      <p className="text-xs text-muted-foreground">
        Pass a BCP 47 <code className="font-mono">locale</code> string to derive
        labels via <code className="font-mono">Intl.DateTimeFormat</code>, or supply{" "}
        <code className="font-mono">periodLabels</code> directly when your i18n library
        already has the strings. Omitting both keeps{" "}
        <code className="font-mono">AM / PM</code> and avoids any SSR mismatch.
      </p>
    </div>
  )
}

export function ScrollToStepDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Row label="Off (default)">
          <TimeInput defaultValue="14:05" />
        </Row>
        <Row label="On">
          <TimeInput scrollToStep defaultValue="14:05" />
        </Row>
      </div>
      <p className="text-xs text-muted-foreground">
        With <code className="font-mono">scrollToStep</code>, click a segment to focus
        it, then scroll to change its value. Disabled by default so scroll never fires
        on hover and doesn&apos;t interfere with page scrolling.
      </p>
    </div>
  )
}

export function SizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Row label="sm">
        <TimeInput size="sm" defaultValue="09:00" />
      </Row>
      <Row label="default">
        <TimeInput size="default" defaultValue="09:00" />
      </Row>
      <Row label="lg">
        <TimeInput size="lg" defaultValue="09:00" />
      </Row>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
