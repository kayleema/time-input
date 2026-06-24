import * as React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { TimeInput } from "../time-input"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// All three segment inputs are now type="text" → role="textbox"
function getHours() {
  return screen.getByRole("textbox", { name: "Hours" }) as HTMLInputElement
}
function getMinutes() {
  // minutes no longer has a default aria-label (use minutesAriaLabel prop to set one)
  return screen.getAllByRole("textbox")[1] as HTMLInputElement
}
function getSeconds() {
  return screen.getByRole("textbox", { name: "Seconds" }) as HTMLInputElement
}
function getPeriodButton() {
  return screen.getByRole("button") as HTMLButtonElement
}
function getHidden(container: HTMLElement) {
  return container.querySelector('input[type="hidden"]') as HTMLInputElement
}

function blurContainer(container: HTMLElement) {
  const group = container.querySelector('[role="group"]') as HTMLElement
  fireEvent.blur(group, { relatedTarget: document.body })
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe("Rendering", () => {
  it("renders hours and minutes textboxes by default", () => {
    const { container } = render(<TimeInput />)
    expect(getHours()).toBeInTheDocument()
    expect(getMinutes()).toBeInTheDocument()
    expect(screen.queryByRole("textbox", { name: "Seconds" })).toBeNull()
  })

  it("renders seconds textbox when showSeconds", () => {
    render(<TimeInput showSeconds />)
    expect(getSeconds()).toBeInTheDocument()
  })

  it("does not render AM/PM button in 24h mode", () => {
    render(<TimeInput format="24h" />)
    expect(screen.queryByRole("button")).toBeNull()
  })

  it("renders AM/PM button in 12h mode", () => {
    render(<TimeInput format="12h" />)
    expect(getPeriodButton()).toBeInTheDocument()
  })

  it("applies disabled attribute to all inputs", () => {
    render(<TimeInput disabled defaultValue="09:00" />)
    expect(getHours()).toBeDisabled()
    expect(getMinutes()).toBeDisabled()
  })

  it("applies disabled attribute to period button in 12h mode", () => {
    render(<TimeInput format="12h" disabled defaultValue="09:00" />)
    expect(getPeriodButton()).toBeDisabled()
  })

  it("forwards name to hidden input", () => {
    const { container } = render(<TimeInput name="departure" defaultValue="09:00" />)
    expect(getHidden(container)).toHaveAttribute("name", "departure")
  })

  it("id is forwarded to the hours input, not the hidden input", () => {
    const { container } = render(<TimeInput id="my-time" />)
    expect(getHours()).toHaveAttribute("id", "my-time")
    expect(getHidden(container)).not.toHaveAttribute("id")
  })

  it("minutesAriaLabel sets aria-label on the minutes input", () => {
    render(<TimeInput minutesAriaLabel="Duration minutes" />)
    expect(screen.getByRole("textbox", { name: "Duration minutes" })).toBeInTheDocument()
  })

  it("size sm adds h-9 class", () => {
    const { container } = render(<TimeInput size="sm" />)
    expect(container.firstChild).toHaveClass("h-9")
  })

  it("size lg adds h-11 class", () => {
    const { container } = render(<TimeInput size="lg" />)
    expect(container.firstChild).toHaveClass("h-11")
  })
})

// ---------------------------------------------------------------------------
// Value parsing — controlled
// ---------------------------------------------------------------------------

describe("Value parsing", () => {
  it("24h value='14:05' sets hours='14' minutes='05'", () => {
    render(<TimeInput value="14:05" onChange={() => {}} />)
    expect(getHours()).toHaveValue("14")
    expect(getMinutes()).toHaveValue("05")
  })

  it("12h value='14:30' shows hours='2' minutes='30' period=PM", () => {
    render(<TimeInput format="12h" value="14:30" onChange={() => {}} />)
    expect(getHours()).toHaveValue("2")
    expect(getMinutes()).toHaveValue("30")
    expect(getPeriodButton()).toHaveTextContent("PM")
  })

  it("12h value='00:30' shows hours='12' period=AM (midnight)", () => {
    render(<TimeInput format="12h" value="00:30" onChange={() => {}} />)
    expect(getHours()).toHaveValue("12")
    expect(getPeriodButton()).toHaveTextContent("AM")
  })

  it("12h value='12:00' shows hours='12' period=PM (noon)", () => {
    render(<TimeInput format="12h" value="12:00" onChange={() => {}} />)
    expect(getHours()).toHaveValue("12")
    expect(getPeriodButton()).toHaveTextContent("PM")
  })

  it("empty value leaves segments empty", () => {
    render(<TimeInput value="" onChange={() => {}} />)
    expect(getHours()).toHaveValue("")
    expect(getMinutes()).toHaveValue("")
  })

  it("value with seconds populates seconds segment when showSeconds", () => {
    render(<TimeInput showSeconds value="09:45:30" onChange={() => {}} />)
    expect(getSeconds()).toHaveValue("30")
  })

  it("defaultValue sets initial display without controlling", () => {
    render(<TimeInput defaultValue="14:05" />)
    expect(getHours()).toHaveValue("14")
    expect(getMinutes()).toHaveValue("05")
  })
})

// ---------------------------------------------------------------------------
// Serialization / onChange
// ---------------------------------------------------------------------------

describe("onChange serialization", () => {
  it("emits 24h string after hours and minutes filled", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "14" } })
    fireEvent.change(getMinutes(), { target: { value: "05" } })
    expect(onChange).toHaveBeenLastCalledWith("14:05")
  })

  it("emits empty string while minutes unfilled", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    expect(onChange).toHaveBeenLastCalledWith("")
  })

  it("12h: typing hours=2 minutes=30 period=PM emits 14:30", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "2" } })
    fireEvent.change(getMinutes(), { target: { value: "30" } })
    // period starts AM, click to PM
    fireEvent.click(getPeriodButton())
    expect(onChange).toHaveBeenLastCalledWith("14:30")
  })

  it("hidden input value matches serialized 24h time", () => {
    const { container } = render(<TimeInput defaultValue="09:30" />)
    expect(getHidden(container)).toHaveValue("09:30")
  })

  it("hidden input updates as user types", () => {
    const { container } = render(<TimeInput />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    fireEvent.change(getMinutes(), { target: { value: "30" } })
    expect(getHidden(container)).toHaveValue("09:30")
  })
})

// ---------------------------------------------------------------------------
// Controlled sync (lastEmitted pattern)
// ---------------------------------------------------------------------------

describe("Controlled sync", () => {
  it("external change to value re-syncs display", () => {
    const { rerender } = render(<TimeInput value="09:00" onChange={() => {}} />)
    expect(getHours()).toHaveValue("09")
    rerender(<TimeInput value="14:30" onChange={() => {}} />)
    expect(getHours()).toHaveValue("14")
    expect(getMinutes()).toHaveValue("30")
  })

  it("parent echoing same value back (value prop unchanged) keeps typed state", () => {
    const onChange = vi.fn()
    const { rerender } = render(<TimeInput value="09:00" onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "1" } })
    // Re-render with the same value prop — effect deps [value, format] don't change
    // so the effect doesn't re-run and the typed "1" stays in the input
    rerender(<TimeInput value="09:00" onChange={onChange} />)
    expect(getHours()).toHaveValue("1")
  })
})

// ---------------------------------------------------------------------------
// Typing — hours
// ---------------------------------------------------------------------------

describe("Typing hours", () => {
  it("24h: single digit > 2 auto-advances to minutes", () => {
    render(<TimeInput />)
    const hours = getHours()
    const minutes = getMinutes()
    fireEvent.change(hours, { target: { value: "3" } })
    expect(document.activeElement).toBe(minutes)
  })

  it("24h: digit 2 does NOT auto-advance", () => {
    render(<TimeInput />)
    const hours = getHours()
    hours.focus()
    fireEvent.change(hours, { target: { value: "2" } })
    expect(document.activeElement).toBe(hours)
  })

  it("24h: two digits auto-advance to minutes", () => {
    render(<TimeInput />)
    fireEvent.change(getHours(), { target: { value: "14" } })
    expect(document.activeElement).toBe(getMinutes())
  })

  it("24h: two digits clamp to hourMax (23)", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "25" } })
    // hours clamped to "23"; minutes still empty so onChange emits ""
    expect(getHours()).toHaveValue("23")
    // fill minutes to verify the clamped hour serializes correctly
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    expect(onChange).toHaveBeenLastCalledWith("23:00")
  })

  it("12h: single digit > 1 auto-advances", () => {
    render(<TimeInput format="12h" />)
    const hours = getHours()
    fireEvent.change(hours, { target: { value: "2" } })
    expect(document.activeElement).toBe(getMinutes())
  })

  it("12h: digit 1 does NOT auto-advance", () => {
    render(<TimeInput format="12h" />)
    const hours = getHours()
    hours.focus()
    fireEvent.change(hours, { target: { value: "1" } })
    expect(document.activeElement).toBe(hours)
  })
})

// ---------------------------------------------------------------------------
// Typing — minutes
// ---------------------------------------------------------------------------

describe("Typing minutes", () => {
  it("digit > 5 does not auto-advance in 24h without seconds", () => {
    render(<TimeInput defaultValue="09:00" />)
    const minutes = getMinutes()
    minutes.focus()
    fireEvent.change(minutes, { target: { value: "6" } })
    expect(getMinutes()).toHaveValue("6")
    expect(document.activeElement).toBe(minutes)
  })

  it("digit > 5 auto-advances to seconds when showSeconds", () => {
    render(<TimeInput showSeconds defaultValue="09:00:00" />)
    const minutes = getMinutes()
    minutes.focus()
    fireEvent.change(minutes, { target: { value: "7" } })
    expect(document.activeElement).toBe(getSeconds())
  })

  it("digit > 5 auto-advances to period button in 12h mode", () => {
    render(<TimeInput format="12h" defaultValue="09:00" />)
    const minutes = getMinutes()
    minutes.focus()
    fireEvent.change(minutes, { target: { value: "7" } })
    expect(document.activeElement).toBe(getPeriodButton())
  })

  it("two digits clamp to 59", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "09" } })
    fireEvent.change(getMinutes(), { target: { value: "62" } })
    expect(onChange).toHaveBeenLastCalledWith("09:59")
  })

  it("at max overflow hour, any input forces 00", () => {
    const onChange = vi.fn()
    render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={24}
        defaultValue="24:00"
        onChange={onChange}
      />
    )
    fireEvent.change(getMinutes(), { target: { value: "5" } })
    expect(onChange).toHaveBeenLastCalledWith("24:00")
  })
})

// ---------------------------------------------------------------------------
// Typing — seconds
// ---------------------------------------------------------------------------

describe("Typing seconds", () => {
  it("digit > 5 auto-advances to period button in 12h mode", () => {
    render(<TimeInput format="12h" showSeconds defaultValue="09:00:00" />)
    const seconds = getSeconds()
    seconds.focus()
    fireEvent.change(seconds, { target: { value: "7" } })
    expect(document.activeElement).toBe(getPeriodButton())
  })

  it("two digits clamp to 59", () => {
    const onChange = vi.fn()
    render(<TimeInput showSeconds onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "09" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    fireEvent.change(getSeconds(), { target: { value: "65" } })
    expect(onChange).toHaveBeenLastCalledWith("09:00:59")
  })
})

// ---------------------------------------------------------------------------
// Blur padding
// ---------------------------------------------------------------------------

describe("Blur padding", () => {
  it("blurring hours with single digit pads to two", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="09:00" onChange={onChange} />)
    const hours = getHours()
    fireEvent.change(hours, { target: { value: "3" } })
    fireEvent.blur(hours)
    // pad() commits "03" — text input stores as string "03"
    expect(hours.value).toBe("03")
    expect(hours).toHaveValue("03")
  })

  it("blurring minutes with single digit pads to two digits", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    fireEvent.change(getMinutes(), { target: { value: "5" } })
    fireEvent.blur(getMinutes())
    expect(onChange).toHaveBeenLastCalledWith("09:05")
  })

  it("empty segment on blur stays empty", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.blur(getHours())
    expect(onChange).not.toHaveBeenCalled()
  })

  it("24h hours value 25 is already clamped at input time", () => {
    render(<TimeInput />)
    fireEvent.change(getHours(), { target: { value: "25" } })
    // getDigits clamps via Math.min to 23 immediately on change
    expect(getHours()).toHaveValue("23")
  })

  it("12h hours clamped to 1-12 on blur", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "0" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    fireEvent.blur(getHours())
    // 0 → clamped to 1
    expect(onChange).toHaveBeenLastCalledWith("01:00")
  })
})

// ---------------------------------------------------------------------------
// onBlur callback
// ---------------------------------------------------------------------------

describe("onBlur callback", () => {
  it("receives serialized value string (not an event)", () => {
    const onBlur = vi.fn()
    render(<TimeInput defaultValue="09:30" onBlur={onBlur} />)
    fireEvent.blur(getHours())
    expect(onBlur).toHaveBeenCalledWith("09:30")
    expect(typeof onBlur.mock.calls[0][0]).toBe("string")
  })

  it("receives empty string when time is incomplete", () => {
    const onBlur = vi.fn()
    render(<TimeInput onBlur={onBlur} />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    fireEvent.blur(getHours())
    expect(onBlur).toHaveBeenCalledWith("")
  })

  it("receives updated value after blur padding commits", () => {
    const onBlur = vi.fn()
    render(<TimeInput defaultValue="09:30" onBlur={onBlur} />)
    // type a single digit — pad() will commit "03" before onBlur fires
    fireEvent.change(getHours(), { target: { value: "3" } })
    fireEvent.blur(getHours())
    expect(onBlur).toHaveBeenCalledWith("03:30")
  })
})

// ---------------------------------------------------------------------------
// Keyboard — arrow keys
// ---------------------------------------------------------------------------

describe("Keyboard arrow keys", () => {
  it("ArrowUp increments hours", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:05" onChange={onChange} />)
    fireEvent.keyDown(getHours(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("15:05")
  })

  it("ArrowDown decrements hours", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:05" onChange={onChange} />)
    fireEvent.keyDown(getHours(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("13:05")
  })

  it("ArrowUp wraps hours 23→00 in 24h", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="23:05" onChange={onChange} />)
    fireEvent.keyDown(getHours(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("00:05")
  })

  it("ArrowDown wraps hours 00→23 in 24h", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="00:05" onChange={onChange} />)
    fireEvent.keyDown(getHours(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("23:05")
  })

  it("ArrowUp on 12h PM hour 12 wraps display around to 01", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="12:05" onChange={onChange} />)
    // 12:05 PM → ArrowUp → 01:05 PM (display wraps 12→1, period stays PM)
    fireEvent.keyDown(getHours(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("13:05")
  })

  it("ArrowDown on 12h AM hour 01 wraps display to 12", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="01:05" onChange={onChange} />)
    // 01:05 AM display=1 → down → 12 AM → serializes as 00:05
    fireEvent.keyDown(getHours(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("00:05")
  })

  it("ArrowUp increments minutes", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:05" onChange={onChange} />)
    fireEvent.keyDown(getMinutes(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("14:06")
  })

  it("ArrowDown wraps minutes 00→59", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:00" onChange={onChange} />)
    fireEvent.keyDown(getMinutes(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("14:59")
  })

  it("ArrowUp wraps minutes 59→00", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:59" onChange={onChange} />)
    fireEvent.keyDown(getMinutes(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("14:00")
  })

  it("prevents default on arrow keys to stop page scroll", () => {
    render(<TimeInput defaultValue="14:05" />)
    const ev = new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true })
    act(() => { getHours().dispatchEvent(ev) })
    expect(ev.defaultPrevented).toBe(true)
  })

  it("ArrowDown on minutes at max overflow hour stays 00", () => {
    const onChange = vi.fn()
    render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={24}
        defaultValue="24:00"
        onChange={onChange}
      />
    )
    fireEvent.keyDown(getMinutes(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("24:00")
  })
})

// ---------------------------------------------------------------------------
// Keyboard — Backspace navigation
// ---------------------------------------------------------------------------

describe("Keyboard Backspace navigation", () => {
  it("Backspace on empty minutes focuses hours", () => {
    render(<TimeInput />)
    const minutes = getMinutes()
    minutes.focus()
    // minutes is empty
    fireEvent.keyDown(minutes, { key: "Backspace" })
    expect(document.activeElement).toBe(getHours())
  })

  it("Backspace on empty seconds focuses minutes", () => {
    render(<TimeInput showSeconds />)
    const seconds = getSeconds()
    seconds.focus()
    fireEvent.keyDown(seconds, { key: "Backspace" })
    expect(document.activeElement).toBe(getMinutes())
  })

  it("Backspace on non-empty segment does not change focus", () => {
    render(<TimeInput defaultValue="14:05" />)
    const minutes = getMinutes()
    minutes.focus()
    fireEvent.keyDown(minutes, { key: "Backspace" })
    expect(document.activeElement).toBe(minutes)
  })
})

// ---------------------------------------------------------------------------
// autoFillMinutesOnBlur
// ---------------------------------------------------------------------------

describe("autoFillMinutesOnBlur", () => {
  it("fills empty minutes with 00 when hours set", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput autoFillMinutesOnBlur onChange={onChange} />
    )
    fireEvent.change(getHours(), { target: { value: "9" } })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:00")
  })

  it("does not fill when both empty", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput autoFillMinutesOnBlur onChange={onChange} />
    )
    blurContainer(container)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("disabled by default — no fill", () => {
    const onChange = vi.fn()
    const { container } = render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("")
  })
})

// ---------------------------------------------------------------------------
// Minute rounding
// ---------------------------------------------------------------------------

describe("Minute rounding", () => {
  function renderWithRound(
    opts: {
      defaultValue: string
      interval: number
      mode?: "floor" | "ceil" | "nearest"
      roundLastIntervalDown?: boolean
    }
  ) {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput
        defaultValue={opts.defaultValue}
        roundMinutesToNearest={opts.interval}
        roundMinutesMode={opts.mode ?? "nearest"}
        roundLastIntervalDown={opts.roundLastIntervalDown}
        onChange={onChange}
      />
    )
    return { onChange, container }
  }

  it("nearest: 09:03 with interval 5 → 09:05", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:03", interval: 5 })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:05")
  })

  it("nearest: 09:07 with interval 5 → 09:05", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:07", interval: 5 })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:05")
  })

  it("nearest: 09:08 with interval 5 → 09:10", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:08", interval: 5 })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:10")
  })

  it("floor: 09:09 with interval 5 → 09:05", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:09", interval: 5, mode: "floor" })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:05")
  })

  it("ceil: 09:01 with interval 5 → 09:05", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:01", interval: 5, mode: "ceil" })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("09:05")
  })

  it("nearest: 09:58 with interval 5 → 10:00 (hour bumps)", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:58", interval: 5 })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("10:00")
  })

  it("roundLastIntervalDown: 23:58 nearest 5 → 23:55 (no rollover)", () => {
    const { onChange, container } = renderWithRound({
      defaultValue: "23:58",
      interval: 5,
      roundLastIntervalDown: true,
    })
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("23:55")
  })

  it("12h: 11:58 PM nearest 5 → 00:00 next day (period flips to AM)", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput
        format="12h"
        defaultValue="23:58"
        roundMinutesToNearest={5}
        onChange={onChange}
      />
    )
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("00:00")
  })

  it("already rounded value fires no extra onChange", () => {
    const { onChange, container } = renderWithRound({ defaultValue: "09:05", interval: 5 })
    const callsBefore = onChange.mock.calls.length
    blurContainer(container)
    expect(onChange.mock.calls.length).toBe(callsBefore)
  })
})

// ---------------------------------------------------------------------------
// Overflow hours
// ---------------------------------------------------------------------------

describe("Overflow hours", () => {
  it("allows hours > 23 when allowOverflowHours", () => {
    render(<TimeInput allowOverflowHours maxOverflowHours={27} defaultValue="27:00" />)
    expect(getHours()).toHaveValue("27")
  })

  it("clamps to maxOverflowHours=27", () => {
    const onChange = vi.fn()
    render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={27}
        onChange={onChange}
      />
    )
    fireEvent.change(getHours(), { target: { value: "28" } })
    expect(onChange).toHaveBeenLastCalledWith("")
    // the hours value was clamped to "27"
    expect(getHours()).toHaveValue("27")
  })

  it("ArrowUp at maxOverflowHours wraps back to 00", () => {
    const onChange = vi.fn()
    render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={24}
        defaultValue="24:00"
        onChange={onChange}
      />
    )
    fireEvent.keyDown(getHours(), { key: "ArrowUp" })
    // step() modulo-wraps: (24 + 1) % 25 = 0 → "00:00"
    expect(onChange).toHaveBeenLastCalledWith("00:00")
  })

  it("serializes as 27:00", () => {
    const { container } = render(
      <TimeInput allowOverflowHours maxOverflowHours={27} defaultValue="27:00" />
    )
    expect(getHidden(container)).toHaveValue("27:00")
  })
})

// ---------------------------------------------------------------------------
// 12h AM/PM button
// ---------------------------------------------------------------------------

describe("12h AM/PM toggle", () => {
  it("shows AM for morning times", () => {
    render(<TimeInput format="12h" defaultValue="09:00" />)
    expect(getPeriodButton()).toHaveTextContent("AM")
  })

  it("shows PM for afternoon times", () => {
    render(<TimeInput format="12h" defaultValue="14:00" />)
    expect(getPeriodButton()).toHaveTextContent("PM")
  })

  it("click toggles AM→PM and fires onChange with 24h value", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="09:00" onChange={onChange} />)
    fireEvent.click(getPeriodButton())
    expect(onChange).toHaveBeenLastCalledWith("21:00")
  })

  it("click toggles PM→AM", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="14:00" onChange={onChange} />)
    fireEvent.click(getPeriodButton())
    expect(onChange).toHaveBeenLastCalledWith("02:00")
  })

  it("Space key on button toggles period", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="09:00" onChange={onChange} />)
    fireEvent.keyDown(getPeriodButton(), { key: " " })
    expect(onChange).toHaveBeenLastCalledWith("21:00")
  })

  it("ArrowUp key on button toggles period", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="09:00" onChange={onChange} />)
    fireEvent.keyDown(getPeriodButton(), { key: "ArrowUp" })
    expect(onChange).toHaveBeenLastCalledWith("21:00")
  })

  it("ArrowDown key on button toggles period", () => {
    const onChange = vi.fn()
    render(<TimeInput format="12h" defaultValue="09:00" onChange={onChange} />)
    fireEvent.keyDown(getPeriodButton(), { key: "ArrowDown" })
    expect(onChange).toHaveBeenLastCalledWith("21:00")
  })

  it("aria-label reflects current period", () => {
    render(<TimeInput format="12h" defaultValue="09:00" />)
    expect(getPeriodButton()).toHaveAttribute(
      "aria-label",
      expect.stringContaining("AM")
    )
  })
})

// ---------------------------------------------------------------------------
// Localization
// ---------------------------------------------------------------------------

describe("Localization", () => {
  it("periodLabels override shows custom labels", () => {
    render(
      <TimeInput
        format="12h"
        periodLabels={{ am: "오전", pm: "오후" }}
        defaultValue="09:00"
      />
    )
    expect(getPeriodButton()).toHaveTextContent("오전")
  })

  it("periodLabels PM label shown for PM times", () => {
    render(
      <TimeInput
        format="12h"
        periodLabels={{ am: "오전", pm: "오후" }}
        defaultValue="14:00"
      />
    )
    expect(getPeriodButton()).toHaveTextContent("오후")
  })

  it("no locale and no periodLabels shows AM/PM", () => {
    render(<TimeInput format="12h" defaultValue="09:00" />)
    expect(getPeriodButton()).toHaveTextContent("AM")
  })

  it("locale ko-KR shows Korean period labels", () => {
    render(<TimeInput format="12h" locale="ko-KR" defaultValue="09:00" />)
    // Intl in jsdom may or may not support this locale but should not crash
    expect(getPeriodButton()).toBeInTheDocument()
  })

  it("invalid locale string falls back to AM/PM without throwing", () => {
    expect(() => {
      render(<TimeInput format="12h" locale="not-a-real-locale" defaultValue="09:00" />)
    }).not.toThrow()
    expect(getPeriodButton()).toBeInTheDocument()
  })

  it("periodLabels take precedence over locale", () => {
    render(
      <TimeInput
        format="12h"
        locale="ko-KR"
        periodLabels={{ am: "vorm.", pm: "nachm." }}
        defaultValue="09:00"
      />
    )
    expect(getPeriodButton()).toHaveTextContent("vorm.")
  })
})

// ---------------------------------------------------------------------------
// scrollToStep
// ---------------------------------------------------------------------------

describe("scrollToStep", () => {
  it("wheel on unfocused input does not change value (default scrollToStep=false)", () => {
    const onChange = vi.fn()
    render(<TimeInput defaultValue="14:05" onChange={onChange} />)
    const hours = getHours()
    fireEvent.wheel(hours, { deltaY: -100 })
    expect(onChange).not.toHaveBeenCalled()
  })

  it("wheel preventDefault is called (non-passive, via native listener)", () => {
    render(<TimeInput defaultValue="14:05" />)
    const hours = getHours()
    const ev = new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true })
    act(() => { hours.dispatchEvent(ev) })
    expect(ev.defaultPrevented).toBe(true)
  })

  it("scrollToStep=true + focused: wheel up increments", () => {
    const onChange = vi.fn()
    render(<TimeInput scrollToStep defaultValue="14:05" onChange={onChange} />)
    const hours = getHours()
    hours.focus()
    act(() => {
      hours.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true }))
    })
    expect(onChange).toHaveBeenLastCalledWith("15:05")
  })

  it("scrollToStep=true + focused: wheel down decrements", () => {
    const onChange = vi.fn()
    render(<TimeInput scrollToStep defaultValue="14:05" onChange={onChange} />)
    const hours = getHours()
    hours.focus()
    act(() => {
      hours.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true }))
    })
    expect(onChange).toHaveBeenLastCalledWith("13:05")
  })

  it("scrollToStep=true + NOT focused: wheel does not change value", () => {
    const onChange = vi.fn()
    render(<TimeInput scrollToStep defaultValue="14:05" onChange={onChange} />)
    const hours = getHours()
    if (document.activeElement === hours) {
      ;(document.activeElement as HTMLElement).blur()
    }
    act(() => {
      hours.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, bubbles: true, cancelable: true }))
    })
    expect(onChange).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe("Disabled", () => {
  it("all spinbuttons and button are disabled", () => {
    render(<TimeInput format="12h" disabled defaultValue="09:00" />)
    expect(getHours()).toBeDisabled()
    expect(getMinutes()).toBeDisabled()
    expect(getPeriodButton()).toBeDisabled()
  })

  it("handleBlur skips processing when disabled", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput disabled autoFillMinutesOnBlur onChange={onChange} />
    )
    fireEvent.change(getHours(), { target: { value: "9" } })
    blurContainer(container)
    expect(onChange).not.toHaveBeenCalledWith("09:00")
  })
})

// ---------------------------------------------------------------------------
// Form integration
// ---------------------------------------------------------------------------

describe("Form integration", () => {
  it("hidden input has correct name attribute", () => {
    const { container } = render(<TimeInput name="startTime" defaultValue="09:30" />)
    const hidden = getHidden(container)
    expect(hidden).toHaveAttribute("name", "startTime")
  })

  it("hidden input initial value matches defaultValue", () => {
    const { container } = render(<TimeInput name="t" defaultValue="14:30" />)
    expect(getHidden(container)).toHaveValue("14:30")
  })

  it("hidden input updates as user fills in the time", () => {
    const { container } = render(<TimeInput name="t" />)
    fireEvent.change(getHours(), { target: { value: "9" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    expect(getHidden(container)).toHaveValue("09:00")
  })
})

// ---------------------------------------------------------------------------
// Ref forwarding
// ---------------------------------------------------------------------------

describe("Ref forwarding", () => {
  it("ref points to the hidden input element", () => {
    const ref = React.createRef<HTMLInputElement>()
    const { container } = render(<TimeInput ref={ref} defaultValue="09:00" />)
    expect(ref.current).toBe(getHidden(container))
  })
})

// ---------------------------------------------------------------------------
// Focus behavior (handlePointerDown)
// ---------------------------------------------------------------------------

describe("Focus behavior", () => {
  it("clicking wrapper area (not input/button) focuses hours", () => {
    const { container } = render(<TimeInput defaultValue="09:00" />)
    const wrapper = container.querySelector('[role="group"]') as HTMLElement
    fireEvent.pointerDown(wrapper)
    expect(document.activeElement).toBe(getHours())
  })

  it("clicking wrapper when disabled does nothing", () => {
    const { container } = render(<TimeInput disabled defaultValue="09:00" />)
    const wrapper = container.querySelector('[role="group"]') as HTMLElement
    fireEvent.pointerDown(wrapper)
    expect(document.activeElement).not.toBe(getHours())
  })

  it("clicking directly on an input does not re-focus hours", () => {
    render(<TimeInput defaultValue="09:00" />)
    const minutes = getMinutes()
    minutes.focus()
    // pointerdown on the input itself should not redirect to hours
    fireEvent.pointerDown(minutes)
    expect(document.activeElement).toBe(minutes)
  })
})

// ---------------------------------------------------------------------------
// Overflow hours + rounding
// ---------------------------------------------------------------------------

describe("Overflow hours + rounding", () => {
  it("rounding with overflow: minutes rollover increments overflow hour", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={27}
        defaultValue="25:58"
        roundMinutesToNearest={5}
        onChange={onChange}
      />
    )
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("26:00")
  })

  it("rounding at max overflow hour floors instead of rolling over", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={27}
        defaultValue="27:03"
        roundMinutesToNearest={5}
        onChange={onChange}
      />
    )
    blurContainer(container)
    expect(onChange).toHaveBeenLastCalledWith("27:00")
  })

  it("rounding at max overflow hour: already-rounded value fires no onChange", () => {
    const onChange = vi.fn()
    const { container } = render(
      <TimeInput
        allowOverflowHours
        maxOverflowHours={27}
        defaultValue="27:00"
        roundMinutesToNearest={5}
        onChange={onChange}
      />
    )
    const callsBefore = onChange.mock.calls.length
    blurContainer(container)
    expect(onChange.mock.calls.length).toBe(callsBefore)
  })
})

// ---------------------------------------------------------------------------
// Placeholder
// ---------------------------------------------------------------------------

describe("Placeholder", () => {
  it("default 24h placeholder is 00", () => {
    render(<TimeInput />)
    expect(getHours()).toHaveAttribute("placeholder", "00")
    expect(getMinutes()).toHaveAttribute("placeholder", "00")
  })

  it("default 12h hours placeholder is 12", () => {
    render(<TimeInput format="12h" />)
    expect(getHours()).toHaveAttribute("placeholder", "12")
  })

  it("custom placeholder overrides default", () => {
    render(<TimeInput placeholder="--" />)
    expect(getHours()).toHaveAttribute("placeholder", "--")
    expect(getMinutes()).toHaveAttribute("placeholder", "--")
  })
})

// ---------------------------------------------------------------------------
// Text normalization (getDigits — tested through component behavior)
// ---------------------------------------------------------------------------

describe("Text normalization", () => {
  // Full-width digits are the primary Japanese IME output.
  // getDigits() runs normalize("NFKC") before stripping non-digits,
  // so full-width characters transparently become ASCII digits.

  it("full-width hours digits are accepted — common Japanese IME output", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    // "１４" U+FF11 U+FF14 — full-width digits
    fireEvent.change(getHours(), { target: { value: "１４" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    expect(onChange).toHaveBeenLastCalledWith("14:00")
  })

  it("single full-width digit auto-advances when above threshold", () => {
    render(<TimeInput />)
    // "３" U+FF13 → NFKC "3" → digit 3 > 2 → auto-advance in 24h
    fireEvent.change(getHours(), { target: { value: "３" } })
    expect(document.activeElement).toBe(getMinutes())
  })

  it("full-width minutes digits are accepted", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "09" } })
    // "３０" → NFKC "30"
    fireEvent.change(getMinutes(), { target: { value: "３０" } })
    expect(onChange).toHaveBeenLastCalledWith("09:30")
  })

  it("full-width seconds digits are accepted", () => {
    const onChange = vi.fn()
    render(<TimeInput showSeconds onChange={onChange} />)
    fireEvent.change(getHours(), { target: { value: "09" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    // "４５" → NFKC "45"
    fireEvent.change(getSeconds(), { target: { value: "４５" } })
    expect(onChange).toHaveBeenLastCalledWith("09:00:45")
  })

  it("mixed full-width and ASCII digits both normalized", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    // "1２" → NFKC "12"
    fireEvent.change(getHours(), { target: { value: "1２" } })
    fireEvent.change(getMinutes(), { target: { value: "00" } })
    expect(onChange).toHaveBeenLastCalledWith("12:00")
  })

  it("superscript digits normalize via NFKC", () => {
    render(<TimeInput />)
    // "¹²" U+00B9 U+00B2 → NFKC "12"
    fireEvent.change(getHours(), { target: { value: "¹²" } })
    expect(getHours()).toHaveValue("12")
  })

  it("non-numeric letters are stripped before digits are kept", () => {
    render(<TimeInput />)
    // "a9" → NFKC "a9" → replace non-digits → "9" → value "9"
    fireEvent.change(getHours(), { target: { value: "a9" } })
    expect(getHours()).toHaveValue("9")
  })

  it("all-letter input produces an empty segment", () => {
    render(<TimeInput />)
    fireEvent.change(getHours(), { target: { value: "abc" } })
    expect(getHours()).toHaveValue("")
  })

  it("more than 2 digits keeps only the last 2 (slice(-2))", () => {
    render(<TimeInput />)
    // "123" → slice(-2) → "23" → two digits → auto-advances + clamps to 23
    fireEvent.change(getHours(), { target: { value: "123" } })
    expect(getHours()).toHaveValue("23")
    expect(document.activeElement).toBe(getMinutes())
  })

  it("more than 2 full-width digits keeps last 2", () => {
    render(<TimeInput />)
    // "１２３" → NFKC "123" → slice(-2) → "23"
    fireEvent.change(getHours(), { target: { value: "１２３" } })
    expect(getHours()).toHaveValue("23")
  })

  it("letter-surrounded digits are extracted correctly", () => {
    render(<TimeInput />)
    // "1a2" → replace non-digits → "12" → slice(-2) → "12"
    fireEvent.change(getHours(), { target: { value: "1a2" } })
    expect(getHours()).toHaveValue("12")
    expect(document.activeElement).toBe(getMinutes())
  })

  it("full-width digit clamped correctly at hourMax (24h)", () => {
    const onChange = vi.fn()
    render(<TimeInput onChange={onChange} />)
    // "２５" → "25" → clamp to 23 → "23"
    fireEvent.change(getHours(), { target: { value: "２５" } })
    expect(getHours()).toHaveValue("23")
  })
})
