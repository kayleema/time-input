import * as React from "react"

function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <p className="mb-1.5 text-xs font-semibold tracking-wide">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1 font-mono text-xs">{children}</code>
  )
}

export function WhySection() {
  return (
    <div className="flex flex-col gap-6">

      {/* Motivation */}
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          The native <InlineCode>&lt;input type="time"&gt;</InlineCode> is nearly impossible to
          style, behaves inconsistently across browsers and operating systems, and exposes no
          JavaScript API for formatting. It auto-advances focus differently in Chrome versus
          Firefox, renders a browser-native picker that ignores your design tokens, and provides
          no mechanism for rounding, zero-filling, or overflow hours.
        </p>
        <p>
          Existing third-party time pickers solve some of these problems but introduce their own
          design systems — requiring overrides to match shadcn/ui tokens — and none handle the
          full-width digit output produced by CJK input methods. This component installs as a
          single file via the shadcn registry and uses only the CSS variables already in your
          project.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <FeatureCard title="Zero-pad on blur">
          When a user types <InlineCode>9</InlineCode> and tabs away the component emits{" "}
          <InlineCode>09:00</InlineCode>, not a bare <InlineCode>9</InlineCode>. The native input
          does not do this. Neither does any commonly-used React time picker.
        </FeatureCard>

        <FeatureCard title="Minute rounding">
          Rounds to the nearest configurable interval on blur — with three modes:{" "}
          <InlineCode>nearest</InlineCode>, <InlineCode>floor</InlineCode>, and{" "}
          <InlineCode>ceil</InlineCode>. Day-boundary awareness prevents rolling past{" "}
          <InlineCode>23:55</InlineCode> when <InlineCode>roundLastIntervalDown</InlineCode> is
          set, so scheduling UIs never accidentally advance to the next calendar day.
        </FeatureCard>

        <FeatureCard title="CJK input method normalization">
          Japanese, Chinese, and Korean IMEs routinely emit full-width digits (１, ２, …) instead
          of ASCII digits. The component normalizes all input through NFKC before extracting
          digits, so users typing in their native input method see the same seamless experience
          as those on a US keyboard.
        </FeatureCard>

        <FeatureCard title="Overflow hours">
          Values like <InlineCode>27:00</InlineCode> — common in broadcast scheduling, shift
          planning, and next-day time tracking — are fully supported.{" "}
          <InlineCode>maxOverflowHours</InlineCode> caps the range, and rounding is
          overflow-aware so it will not accidentally roll a 27-hour value back to 00:00.
        </FeatureCard>

        <FeatureCard title="shadcn/ui native">
          Distributed through the shadcn registry as a single source file. It reads{" "}
          <InlineCode>--border</InlineCode>, <InlineCode>--input</InlineCode>,{" "}
          <InlineCode>--ring</InlineCode>, and the rest of your existing CSS variables with no
          additional configuration. Dark mode, radius, and brand colors are inherited
          automatically.
        </FeatureCard>

        <FeatureCard title="Consistent 24h output">
          The <InlineCode>value</InlineCode> / <InlineCode>onChange</InlineCode> contract is
          always <InlineCode>HH:mm</InlineCode> or <InlineCode>HH:mm:ss</InlineCode> in 24-hour
          format, regardless of whether 12h display is active. Forms, validation libraries, and
          server handlers receive a predictable string and never need to parse AM/PM.
        </FeatureCard>
      </div>

      {/* CJK deep-dive */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          How CJK normalization works
        </h3>
        <div className="flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          <p>
            Unicode's "Halfwidth and Fullwidth Forms" block (U+FF00–U+FFEF) contains full-width
            variants of every ASCII character. Japanese IMEs use these when the user is in
            full-width input mode — the common default for number entry on many systems. The
            digits <InlineCode>０１２３４５６７８９</InlineCode> (U+FF10–U+FF19) look like
            regular numbers but are distinct code points that most inputs silently reject or
            mishandle.
          </p>
          <p>
            NFKC (Compatibility Decomposition followed by Canonical Composition) is one of four
            Unicode normalization forms. It maps compatibility characters to their canonical
            equivalents — full-width digits become ASCII digits, superscripts like{" "}
            <InlineCode>¹²</InlineCode> (U+00B9, U+00B2) become <InlineCode>12</InlineCode>,
            and ligatures like <InlineCode>ﬁ</InlineCode> become <InlineCode>fi</InlineCode>.
            The internal <InlineCode>getDigits</InlineCode> helper runs every keystroke's value
            through this transform before stripping non-digits:
          </p>
        </div>
        <pre className="overflow-x-auto rounded border border-border bg-background px-4 py-3 text-xs leading-relaxed">
          <code>{`function getDigits(raw: string) {
  return raw
    .normalize("NFKC")   // "１４" → "14",  "¹²" → "12"
    .replace(/\\D/g, "")  // strip anything that isn't 0–9
    .slice(-2)            // keep last 2 digits (handles IME composing state)
}`}</code>
        </pre>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The <InlineCode>.slice(-2)</InlineCode> is specifically important for IME composing
          state: while an IME is mid-composition the input's value may temporarily contain the
          partially-composed string concatenated with the prior value. Taking the last two
          characters ensures the committed digit always wins without needing to track composing
          events explicitly.
        </p>
      </div>

      {/* Comparison table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left font-semibold">Feature</th>
              <th className="px-4 py-2.5 text-center font-semibold">
                <InlineCode>type="time"</InlineCode>
              </th>
              <th className="px-4 py-2.5 text-center font-semibold">Other pickers</th>
              <th className="px-4 py-2.5 text-center font-semibold">time-input</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["shadcn/ui tokens", false, false, true],
              ["Zero-pad on blur", false, "varies", true],
              ["Minute rounding", false, false, true],
              ["CJK normalization", false, false, true],
              ["Overflow hours", false, false, true],
              ["12h + 24h display", "system", "varies", true],
              ["Consistent 24h output", false, "varies", true],
              ["Single-file install", false, false, true],
              ["No extra dependencies", true, false, true],
            ] as const).map(([feature, native, others, ti]) => (
              <tr key={feature as string} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(native)}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(others)}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(ti)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

function renderCell(value: boolean | string) {
  if (value === true) return <span className="font-semibold text-foreground">Yes</span>
  if (value === false) return <span className="text-muted-foreground/50">No</span>
  return <span className="text-muted-foreground">{value}</span>
}
