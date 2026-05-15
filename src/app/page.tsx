import { InstallCommand, InteractiveDemo, VariantsDemo, SizesDemo } from "./demo"

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

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight">time-input</h1>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              registry:ui
            </span>
          </div>
          <p className="text-muted-foreground">
            A flexible time input for shadcn/ui projects. Supports 24h and 12h formats,
            AM/PM toggle, optional seconds, and auto zero-padding on blur — everything
            the native <code className="rounded bg-muted px-1 font-mono text-xs">type=&quot;time&quot;</code> can&apos;t do.
          </p>
        </div>

        {/* Install */}
        <Section title="Install">
          <InstallCommand url={REGISTRY_URL} />
          <p className="text-xs text-muted-foreground">
            Requires an existing shadcn/ui project (<code className="font-mono">npx shadcn@latest init</code>).
            After installing, import from <code className="font-mono">@/components/ui/time-input</code>.
          </p>
        </Section>

        {/* Interactive */}
        <Section title="Live demo">
          <InteractiveDemo />
        </Section>

        {/* Variants */}
        <Section title="Variants">
          <VariantsDemo />
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          <SizesDemo />
        </Section>

        {/* Usage */}
        <Section title="Usage">
          <CodeBlock>{`import { TimeInput } from "@/components/ui/time-input"

// Controlled (24h)
const [time, setTime] = React.useState("14:05")
<TimeInput value={time} onChange={setTime} />

// 12-hour with AM/PM
<TimeInput format="12h" value={time} onChange={setTime} />

// With seconds
<TimeInput showSeconds value={time} onChange={setTime} />

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
        <Section title="Keyboard">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["↑ / ↓", "Increment or decrement the focused segment"],
                  ["Tab", "Move to the next segment"],
                  ["Shift+Tab", "Move to the previous segment"],
                  ["Backspace on empty", "Jump focus back to previous segment"],
                  ["Space / ↑ / ↓ on AM/PM", "Toggle between AM and PM"],
                ].map(([key, desc]) => (
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
        <Section title="Props">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">Prop</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">Type</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold">Default</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["value", "string", "—"],
                  ["defaultValue", "string", "—"],
                  ["onChange", "(value: string) => void", "—"],
                  ["format", '"12h" | "24h"', '"24h"'],
                  ["showSeconds", "boolean", "false"],
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
        <p className="text-xs text-muted-foreground">
          The <code className="font-mono">value</code> / <code className="font-mono">onChange</code> pair
          always uses 24-hour format (<code className="font-mono">"HH:mm"</code> or{" "}
          <code className="font-mono">"HH:mm:ss"</code>) regardless of the <code className="font-mono">format</code> prop.
          The component emits an empty string while either hours or minutes is unfilled.
        </p>
      </div>
    </main>
  )
}
