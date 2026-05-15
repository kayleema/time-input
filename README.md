# time-input

A time input component for [shadcn/ui](https://ui.shadcn.com) projects. Install it the same way as any other shadcn component — it lands in your `components/ui/` folder and is yours to own.

**Why not `<input type="time">`?**

- Can't auto-pad — browsers let users leave minutes as `5` instead of `05`
- Unstyled in most browsers; impossible to match your design system
- No way to separate 12h display from a 24h stored value
- Inconsistent keyboard UX across browsers and OSes

## Demo

```
npm run dev
```

Opens at `http://localhost:3000` with interactive examples and the full props reference.

## Installation

Requires an existing shadcn/ui project (`npx shadcn@latest init`).

```bash
npx shadcn@latest add https://your-domain.com/r/time-input.json
```

For local development of this repo, start the dev server first and use:

```bash
npx shadcn@latest add http://localhost:3000/r/time-input.json
```

The component is copied into your project at `components/ui/time-input.tsx`. No runtime dependency on this repo.

## Usage

```tsx
import { TimeInput } from "@/components/ui/time-input"
```

### Controlled

```tsx
const [time, setTime] = React.useState("14:05")

<TimeInput value={time} onChange={setTime} />
```

`value` and `onChange` always use 24-hour format (`"HH:mm"` or `"HH:mm:ss"`), regardless of how the component is displayed. `onChange` fires `""` while the input is incomplete.

### 12-hour display with AM/PM

```tsx
<TimeInput format="12h" value={time} onChange={setTime} />
```

The stored value remains 24-hour. `"14:30"` displays as `2:30 PM`; clicking AM/PM or pressing `↑`/`↓`/`Space` on the toggle emits the correct 24h value.

### With seconds

```tsx
<TimeInput showSeconds value={time} onChange={setTime} />
// value shape: "HH:mm:ss"
```

### Uncontrolled

```tsx
<TimeInput defaultValue="09:00" />
```

### Native form submission

The component renders a hidden `<input>` that carries the serialized value, so it works with plain HTML forms and server actions without any extra wiring:

```tsx
<form action="/api/schedule">
  <TimeInput name="departure" defaultValue="09:00" />
  <button type="submit">Save</button>
</form>
```

### React Hook Form

```tsx
import { Controller } from "react-hook-form"

<Controller
  control={control}
  name="startTime"
  render={({ field }) => (
    <TimeInput value={field.value} onChange={field.onChange} />
  )}
/>
```

### Sizes

```tsx
<TimeInput size="sm" />       // h-9
<TimeInput size="default" />  // h-10 (default)
<TimeInput size="lg" />       // h-11
```

### Custom styling

`className` is forwarded to the wrapper `<div>`, which is where the border and focus ring live:

```tsx
<TimeInput className="w-full" />
<TimeInput className="border-red-500" />  // error state
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled value, 24h format (`"HH:mm"` or `"HH:mm:ss"`) |
| `defaultValue` | `string` | — | Uncontrolled initial value |
| `onChange` | `(value: string) => void` | — | Called on every change; `""` while incomplete |
| `format` | `"12h" \| "24h"` | `"24h"` | Display format; does not affect the value shape |
| `showSeconds` | `boolean` | `false` | Show a seconds segment |
| `disabled` | `boolean` | `false` | |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | |
| `name` | `string` | — | Forwarded to the hidden input for form submission |
| `id` | `string` | — | Forwarded to the hidden input |
| `className` | `string` | — | Applied to the wrapper `<div>` |
| `ref` | `React.Ref<HTMLInputElement>` | — | Forwarded to the hidden input |

All other `HTMLAttributes<HTMLDivElement>` props (`data-*`, `aria-*`, event handlers, etc.) are spread onto the wrapper `<div>`.

## Keyboard

| Key | Action |
|---|---|
| `↑` / `↓` | Increment or decrement the focused segment (wraps) |
| `Tab` / `Shift+Tab` | Move between segments |
| `Backspace` on empty segment | Jump focus to the previous segment |
| `↑` / `↓` / `Space` on AM/PM | Toggle between AM and PM |

## Contributing

### Setup

```bash
git clone <repo>
cd time-input
npm install
npm run dev
```

### Editing the component

The component source is at `src/components/ui/time-input.tsx`. After making changes, regenerate the registry JSON so it stays in sync with what users install:

```bash
npm run registry:build
```

Commit both the component and the updated `public/r/time-input.json`.

### Deploying the docs site

Set `NEXT_PUBLIC_URL` to your production URL (e.g. `https://time-input.yourdomain.com`). This controls the install command shown on the docs page and must match where `public/r/time-input.json` is served.

```bash
NEXT_PUBLIC_URL=https://time-input.yourdomain.com npm run build
```
