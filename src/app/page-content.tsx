"use client"

import * as React from "react"
import { InstallCommand, InteractiveDemo, VariantsDemo, LocaleDemo, ScrollToStepDemo, SizesDemo } from "./demo"
import { WhySection } from "./features"
import { useLocale, LocaleToggle } from "./locale-provider"
import { strings } from "./i18n"

const REGISTRY_URL = process.env.NEXT_PUBLIC_URL
  ? `${process.env.NEXT_PUBLIC_URL}/r/time-input.json`
  : "http://localhost:3000/r/time-input.json"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  )
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1 font-mono text-xs">{children}</code>
}

export function PageContent() {
  const { locale } = useLocale()
  const s = strings[locale]

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold tracking-tight">time-input</h1>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {s.badge}
              </span>
            </div>
            <LocaleToggle />
          </div>
          {locale === "ja" ? (
            <p className="text-muted-foreground">
              shadcn/uiプロジェクト向けの柔軟な時刻入力コンポーネントです。24時間・12時間形式、AM/PMトグル、秒の表示、ブラー時の自動ゼロ埋めに対応しています。ネイティブの{" "}
              <C>type=&quot;time&quot;</C> では実現できないすべての機能を提供します。
            </p>
          ) : (
            <p className="text-muted-foreground">
              A flexible time input for shadcn/ui projects. Supports 24h and 12h formats,
              AM/PM toggle, optional seconds, and auto zero-padding on blur — everything
              the native <C>type=&quot;time&quot;</C> can&apos;t do.
            </p>
          )}
        </div>

        {/* Why */}
        <Section title={s.sectionWhy}>
          <WhySection />
        </Section>

        {/* Install */}
        <Section title={s.sectionInstall}>
          <InstallCommand url={REGISTRY_URL} />
          {locale === "ja" ? (
            <p className="text-xs text-muted-foreground">
              既存のshadcn/uiプロジェクトが必要です（<C>npx shadcn@latest init</C>）。
              インストール後は <C>@/components/ui/time-input</C> からインポートしてください。
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Requires an existing shadcn/ui project (<C>npx shadcn@latest init</C>).
              After installing, import from <C>@/components/ui/time-input</C>.
            </p>
          )}
        </Section>

        {/* Interactive */}
        <Section title={s.sectionLiveDemo}>
          <InteractiveDemo />
        </Section>

        {/* Variants */}
        <Section title={s.sectionVariants}>
          <VariantsDemo />
        </Section>

        {/* Localization */}
        <Section title={s.sectionLocalization}>
          <LocaleDemo />
        </Section>

        {/* Scroll to step */}
        <Section title={s.sectionScrollToStep}>
          <ScrollToStepDemo />
        </Section>

        {/* Sizes */}
        <Section title={s.sectionSizes}>
          <SizesDemo />
        </Section>

        {/* Usage */}
        <Section title={s.sectionUsage}>
          <CodeBlock>{`import { TimeInput } from "@/components/ui/time-input"

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
/>`}</CodeBlock>
        </Section>

        {/* Keyboard */}
        <Section title={s.sectionKeyboard}>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {s.keyRows.map(([key, desc]) => (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {key}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Props */}
        <Section title={s.sectionProps}>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">{s.colProp}</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">{s.colType}</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">{s.colDefault}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["value", "string", "—"],
                  ["defaultValue", "string", "—"],
                  ["onChange", "(value: string) => void", "—"],
                  ["format", '"12h" | "24h"', '"24h"'],
                  ["showSeconds", "boolean", "false"],
                  ["placeholder", "string", "—"],
                  ["autoFillMinutesOnBlur", "boolean", "false"],
                  ["roundMinutesToNearest", "number", "—"],
                  ["roundMinutesMode", '"floor" | "ceil" | "nearest"', '"nearest"'],
                  ["roundLastIntervalDown", "boolean", "false"],
                  ["allowOverflowHours", "boolean", "false"],
                  ["maxOverflowHours", "number", "99"],
                  ["locale", "string", "—"],
                  ["periodLabels", "{ am: string; pm: string }", "—"],
                  ["scrollToStep", "boolean", "false"],
                  ["disabled", "boolean", "false"],
                  ["size", '"sm" | "default" | "lg"', '"default"'],
                  ["name", "string", "—"],
                  ["className", "string", "—"],
                ].map(([prop, type, def]) => (
                  <tr key={prop} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{prop}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{def}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Footer */}
        {locale === "ja" ? (
          <p className="text-xs text-muted-foreground">
            <C>value</C> / <C>onChange</C> の値は、<C>format</C> プロパティにかかわらず常に24時間形式（<C>&quot;HH:mm&quot;</C> または{" "}
            <C>&quot;HH:mm:ss&quot;</C>）です。時刻または分が未入力の場合は空文字列を返します。
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            The <C>value</C> / <C>onChange</C> pair
            always uses 24-hour format (<C>&quot;HH:mm&quot;</C> or{" "}
            <C>&quot;HH:mm:ss&quot;</C>) regardless of the <C>format</C> prop.
            The component emits an empty string while either hours or minutes is unfilled.
          </p>
        )}

        <Section title={""}>
          <div className="flex items-center gap-2 justify-center">
            <img src="icon.png"  alt="clockCat" width="32px" className="[image-rendering:pixelated]"/>
          </div>
        </Section>

      </div>
    </main>
  )
}
