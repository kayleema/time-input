"use client"

import * as React from "react"
import { InstallCommand, InteractiveDemo, VariantsDemo, LocaleDemo, ScrollToStepDemo, SizesDemo } from "./demo"
import { WhySection } from "./features"
import { useLocale, LocaleToggle } from "./locale-provider"
import { ThemeToggle } from "./theme-provider"
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

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1 font-mono text-xs">{children}</code>
}

export function PageContent({ usageBlock }: { usageBlock: React.ReactNode }) {
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
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/kayleema/time-input"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View on GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle />
              <LocaleToggle />
            </div>
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
          {usageBlock}
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
                  ["onBlur", "(value: string) => void", "—"],
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
                  ["minutesAriaLabel", "string", "—"],
                  ["unitSuffixes", "{ hours: string; minutes: string; seconds?: string }", "—"],
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
        {locale === "ja" ? (
          <p className="text-xs text-muted-foreground">
            各セグメント入力には <C>autoComplete=&quot;off&quot;</C> が設定されており、時刻フィールドには意味のないブラウザのオートフィルドロップダウンを非表示にします。
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Each segment input sets <C>autoComplete=&quot;off&quot;</C> to suppress the browser
            autofill dropdown, which is not meaningful for time fields.
          </p>
        )}

        <Section title={""}>
          <div className="flex flex-col items-center gap-3">
            <img src="icon.png" alt="clockCat" width="32px" className="[image-rendering:pixelated]"/>
            <a
              href="https://todo.kaylee.jp/board/Date%20Input%20Bug%20Reports"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "ja" ? "バグを報告する" : "Report a bug"}
            </a>
            <a
              href="mailto:skypattern@protonmail.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "ja" ? "お問い合わせ" : "Contact"}
            </a>
          </div>
        </Section>

      </div>
    </main>
  )
}
