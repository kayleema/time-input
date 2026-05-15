"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const timeInputVariants = cva(
  "flex items-center rounded-md border border-input bg-background text-sm ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  {
    variants: {
      size: {
        sm: "h-9 px-2.5",
        default: "h-10 px-3",
        lg: "h-11 px-3 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type Period = "AM" | "PM"

interface Segments {
  hours: string
  minutes: string
  seconds: string
  period: Period
}

function parse(raw: string | undefined, mode: "12h" | "24h"): Segments {
  const empty: Segments = { hours: "", minutes: "", seconds: "", period: "AM" }
  if (!raw) return empty

  const [timePart = ""] = raw.split(" ")
  const [h = "", m = "", s = ""] = timePart.split(":")
  const hNum = parseInt(h, 10)
  if (isNaN(hNum)) return empty

  if (mode === "12h") {
    let display: string
    let period: Period
    if (hNum === 0) {
      display = "12"
      period = "AM"
    } else if (hNum < 12) {
      display = String(hNum)
      period = "AM"
    } else if (hNum === 12) {
      display = "12"
      period = "PM"
    } else {
      display = String(hNum - 12)
      period = "PM"
    }
    return { hours: display, minutes: m, seconds: s, period }
  }

  return { hours: h, minutes: m, seconds: s, period: "AM" }
}

function serialize(seg: Segments, mode: "12h" | "24h", withSeconds: boolean): string {
  if (seg.hours === "" || seg.minutes === "") return ""

  const h = parseInt(seg.hours, 10)
  const m = (seg.minutes || "0").padStart(2, "0")
  const s = (seg.seconds || "0").padStart(2, "0")

  let h24 = h
  if (mode === "12h") {
    if (seg.period === "AM") {
      if (h === 12) h24 = 0
    } else {
      if (h !== 12) h24 = h + 12
    }
  }

  const hStr = String(h24).padStart(2, "0")
  return withSeconds ? `${hStr}:${m}:${s}` : `${hStr}:${m}`
}

export interface TimeInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof timeInputVariants> {
  /** Controlled value in 24-hour format: "HH:mm" or "HH:mm:ss" */
  value?: string
  /** Uncontrolled initial value in 24-hour format */
  defaultValue?: string
  /** Called with the serialized 24-hour value, or "" while incomplete */
  onChange?: (value: string) => void
  /** Display format. Output value is always 24-hour regardless of this prop. */
  format?: "12h" | "24h"
  /** Show the seconds segment */
  showSeconds?: boolean
  disabled?: boolean
  /** Name passed to the hidden input for native form submission */
  name?: string
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      className,
      size,
      value,
      defaultValue,
      onChange,
      format = "24h",
      showSeconds = false,
      disabled = false,
      name,
      id,
      ...props
    },
    ref
  ) => {
    const [seg, setSeg] = React.useState<Segments>(() =>
      parse(value ?? defaultValue, format)
    )
    const lastEmitted = React.useRef(serialize(seg, format, showSeconds))
    const prevFormat = React.useRef(format)

    React.useEffect(() => {
      const formatChanged = prevFormat.current !== format
      prevFormat.current = format
      if (value !== undefined && (value !== lastEmitted.current || formatChanged)) {
        setSeg(parse(value, format))
      }
    }, [value, format])

    const hoursRef = React.useRef<HTMLInputElement>(null)
    const minutesRef = React.useRef<HTMLInputElement>(null)
    const secondsRef = React.useRef<HTMLInputElement>(null)
    const periodRef = React.useRef<HTMLButtonElement>(null)

    function commit(patch: Partial<Segments>) {
      const next = { ...seg, ...patch }
      setSeg(next)
      const emitted = serialize(next, format, showSeconds)
      lastEmitted.current = emitted
      onChange?.(emitted)
    }

    function handleHours(e: React.ChangeEvent<HTMLInputElement>) {
      let digits = e.target.value.replace(/\D/g, "").slice(-2)
      const max = format === "12h" ? 12 : 23
      if (digits.length === 2) {
        digits = String(Math.min(parseInt(digits, 10), max)).padStart(2, "0")
      }
      commit({ hours: digits })

      const threshold = format === "12h" ? 1 : 2
      if (digits.length === 2 || (digits.length === 1 && parseInt(digits, 10) > threshold)) {
        minutesRef.current?.focus()
        minutesRef.current?.select()
      }
    }

    function handleMinutes(e: React.ChangeEvent<HTMLInputElement>) {
      let digits = e.target.value.replace(/\D/g, "").slice(-2)
      if (digits.length === 2) {
        digits = String(Math.min(parseInt(digits, 10), 59)).padStart(2, "0")
      }
      commit({ minutes: digits })

      const advance =
        digits.length === 2 || (digits.length === 1 && parseInt(digits, 10) > 5)
      if (advance) {
        if (showSeconds) {
          secondsRef.current?.focus()
          secondsRef.current?.select()
        } else if (format === "12h") {
          periodRef.current?.focus()
        }
      }
    }

    function handleSeconds(e: React.ChangeEvent<HTMLInputElement>) {
      let digits = e.target.value.replace(/\D/g, "").slice(-2)
      if (digits.length === 2) {
        digits = String(Math.min(parseInt(digits, 10), 59)).padStart(2, "0")
      }
      commit({ seconds: digits })

      const advance =
        digits.length === 2 || (digits.length === 1 && parseInt(digits, 10) > 5)
      if (advance && format === "12h") {
        periodRef.current?.focus()
      }
    }

    function pad(field: "hours" | "minutes" | "seconds") {
      const val = seg[field]
      if (!val) return
      const n = parseInt(val, 10)
      if (isNaN(n)) return

      let clamped: number
      if (field === "hours") {
        const min = format === "12h" ? 1 : 0
        const max = format === "12h" ? 12 : 23
        clamped = Math.max(min, Math.min(max, n))
      } else {
        clamped = Math.min(59, Math.max(0, n))
      }
      commit({ [field]: String(clamped).padStart(2, "0") })
    }

    function step(field: "hours" | "minutes" | "seconds", dir: 1 | -1) {
      const val = parseInt(seg[field] || "0", 10)
      let next: number
      if (field === "hours") {
        const min = format === "12h" ? 1 : 0
        const max = format === "12h" ? 12 : 23
        next = ((val - min + dir + (max - min + 1)) % (max - min + 1)) + min
      } else {
        next = (val + dir + 60) % 60
      }
      commit({ [field]: String(next).padStart(2, "0") })
    }

    function handleKeyDown(
      e: React.KeyboardEvent<HTMLInputElement>,
      field: "hours" | "minutes" | "seconds"
    ) {
      if (e.key === "ArrowUp") { e.preventDefault(); step(field, 1) }
      if (e.key === "ArrowDown") { e.preventDefault(); step(field, -1) }
      if (e.key === "Backspace" && !seg[field]) {
        if (field === "minutes") hoursRef.current?.focus()
        if (field === "seconds") minutesRef.current?.focus()
      }
    }

    const segCls =
      "w-8 bg-transparent text-center tabular-nums outline-none selection:bg-accent selection:text-accent-foreground caret-transparent disabled:cursor-not-allowed"
    const sepCls = "select-none px-px text-muted-foreground"

    return (
      <div
        role="group"
        aria-label="Time input"
        className={cn(
          timeInputVariants({ size }),
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <input
          ref={ref}
          type="hidden"
          name={name}
          id={id}
          value={serialize(seg, format, showSeconds)}
          disabled={disabled}
        />
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          placeholder={format === "12h" ? "12" : "00"}
          maxLength={2}
          disabled={disabled}
          value={seg.hours}
          onChange={handleHours}
          onBlur={() => pad("hours")}
          onKeyDown={(e) => handleKeyDown(e, "hours")}
          onFocus={(e) => e.target.select()}
          className={segCls}
          aria-label="Hours"
        />
        <span className={sepCls} aria-hidden="true">:</span>
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          placeholder="00"
          maxLength={2}
          disabled={disabled}
          value={seg.minutes}
          onChange={handleMinutes}
          onBlur={() => pad("minutes")}
          onKeyDown={(e) => handleKeyDown(e, "minutes")}
          onFocus={(e) => e.target.select()}
          className={segCls}
          aria-label="Minutes"
        />
        {showSeconds && (
          <>
            <span className={sepCls} aria-hidden="true">:</span>
            <input
              ref={secondsRef}
              type="text"
              inputMode="numeric"
              placeholder="00"
              maxLength={2}
              disabled={disabled}
              value={seg.seconds}
              onChange={handleSeconds}
              onBlur={() => pad("seconds")}
              onKeyDown={(e) => handleKeyDown(e, "seconds")}
              onFocus={(e) => e.target.select()}
              className={segCls}
              aria-label="Seconds"
            />
          </>
        )}
        {format === "12h" && (
          <button
            ref={periodRef}
            type="button"
            disabled={disabled}
            onClick={() => commit({ period: seg.period === "AM" ? "PM" : "AM" })}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") {
                e.preventDefault()
                commit({ period: seg.period === "AM" ? "PM" : "AM" })
              }
            }}
            className="ml-1.5 min-w-[2.25rem] rounded px-1 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none"
            aria-label={`Toggle period, currently ${seg.period}`}
          >
            {seg.period || "AM"}
          </button>
        )}
      </div>
    )
  }
)

TimeInput.displayName = "TimeInput"

export { TimeInput, timeInputVariants }
