import type { Metadata } from "next"
import { PageContent } from "./page-content"
import { CodeBlock } from "./code-block"

export const metadata: Metadata = {
  title: "time-input - shadcn-compatible time input",
  description:
    "A flexible time input for shadcn/ui projects. Supports 24h and 12h formats, AM/PM toggle, optional seconds, and auto zero-padding on blur — everything the native type=\"time\" can't do.",
}

const USAGE_CODE = `import { TimeInput } from "@/components/ui/time-input"

// Controlled (24h)
const [time, setTime] = React.useState("14:05")
<TimeInput value={time} onChange={setTime} />

// 12-hour with AM/PM
<TimeInput format="12h" value={time} onChange={setTime} />

// With seconds
<TimeInput showSeconds value={time} onChange={setTime} />

// Custom placeholder
<TimeInput placeholder="--" />

// Fill minutes with 00 when only hours are entered
<TimeInput autoFillMinutesOnBlur />

// Round to the nearest 5 minutes on blur
<TimeInput roundMinutesToNearest={5} />

// Round down or up instead
<TimeInput roundMinutesToNearest={5} roundMinutesMode="floor" />
<TimeInput roundMinutesToNearest={5} roundMinutesMode="ceil" />

// Avoid rolling past 24:00 at the end of the day
<TimeInput
  roundMinutesToNearest={5}
  roundLastIntervalDown
/>

// Allow business-hour overflow such as 27:00
<TimeInput allowOverflowHours maxOverflowHours={27} defaultValue="27:00" />

// Allow exactly 24:00, but nothing beyond
<TimeInput allowOverflowHours maxOverflowHours={24} defaultValue="24:00" />

// Localized AM/PM via Intl.DateTimeFormat
<TimeInput format="12h" locale="ko-KR" />

// Manual labels — use when your i18n library has the strings
<TimeInput format="12h" periodLabels={{ am: t("time.am"), pm: t("time.pm") }} />

// Scroll to step (click a segment first, then scroll)
<TimeInput scrollToStep />

// Sizes
<TimeInput size="sm" />
<TimeInput size="default" />
<TimeInput size="lg" />

// Disabled
<TimeInput disabled defaultValue="09:00" />

// Native form submission
<form action="/submit">
  <TimeInput name="departure" defaultValue="09:00" />
</form>

// React Hook Form
<Controller
  control={control}
  name="startTime"
  render={({ field }) => (
    <TimeInput value={field.value} onChange={field.onChange} />
  )}
/>`

export default async function Page() {
  const usageBlock = <CodeBlock>{USAGE_CODE}</CodeBlock>
  return <PageContent usageBlock={usageBlock} />
}
