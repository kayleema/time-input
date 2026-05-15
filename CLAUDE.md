# time-input

A shadcn/ui-compatible time input component library. The main deliverable is a single React component (`TimeInput`) that users install into their shadcn projects via the registry. This repo also hosts the demo/docs site that serves the registry JSON.

## What this repo contains

```
src/components/ui/time-input.tsx   ← the component (source of truth)
src/app/page.tsx                   ← docs site (server component)
src/app/demo.tsx                   ← interactive demos (client component)
src/lib/utils.ts                   ← cn() helper (standard shadcn)
scripts/build-registry.ts          ← reads the component, writes public/r/time-input.json
public/r/time-input.json           ← generated registry item (do not edit by hand)
registry.json                      ← registry manifest (edit homepage URL when deploying)
```

## Development

```bash
npm run dev          # starts Next.js on localhost:3000
npm run build        # production build (also catches type errors)
npm run registry:build  # regenerate public/r/time-input.json from component source
```

After editing the component, always run `npm run registry:build` so the published JSON stays in sync. The JSON is committed — keep it current.

## Component architecture

`TimeInput` renders a `<div>` wrapper containing:
- A `<input type="hidden">` that carries the serialized value and receives the forwarded `ref`
- Two or three `<input type="text" inputMode="numeric">` segments (hours, minutes, optional seconds)
- A `<button>` for AM/PM toggle when `format="12h"`
- `<span>` colon separators with `aria-hidden`

The wrapper div gets the visible border and `focus-within` ring. Individual segments have no border of their own.

### Two pure functions handle all serialization

**`parse(raw, mode)`** — converts a 24h `"HH:mm"` or `"HH:mm:ss"` string into the internal `Segments` state. In 12h mode, converts `hNum` to display hours (e.g. `14` → `"2"`, `period: "PM"`). Returns all-empty segments for falsy or invalid input.

**`serialize(seg, mode, withSeconds)`** — converts `Segments` back to a 24h string. Returns `""` if either `seg.hours` or `seg.minutes` is an empty string. Always outputs 24h regardless of `mode` — the format prop only affects display.

### Controlled sync: the `lastEmitted` pattern

The component maintains its own internal `seg` state so the user can type freely without the parent re-parsing mid-input. External updates are detected by comparing the incoming `value` prop against `lastEmitted` (a ref that tracks the last value passed to `onChange`):

```
useEffect(() => {
  if (value !== undefined && value !== lastEmitted.current) {
    setSeg(parse(value, format))   // external change → sync from prop
  }
}, [value, format])

function commit(patch) {
  const next = { ...seg, ...patch }
  setSeg(next)
  lastEmitted.current = serialize(next, ...)
  onChange?.(lastEmitted.current)  // internal change → emit, don't re-parse
}
```

`prevFormat` ref handles the edge case where `format` changes while `value` stays the same — the equality check alone wouldn't trigger a re-parse, but the display would be wrong.

### Auto-advance thresholds

When a user types a digit that can't be the leading digit of any valid 2-digit value in that field, focus jumps to the next segment immediately after one digit:

| Field | Threshold | Reason |
|---|---|---|
| Hours (24h) | `> 2` | Valid 2-digit hours start with 0, 1, or 2 only |
| Hours (12h) | `> 1` | Valid 2-digit hours are only 10, 11, 12 |
| Minutes / Seconds | `> 5` | Valid 2-digit values are 00–59 |

On 2-digit input, the value is clamped to the field's max (`Math.min(n, max)`) before committing, so the display immediately shows a valid value.

### Blur padding

`pad(field)` is called `onBlur` for each segment. It parses the current string value, clamps to the valid range, and pads to 2 digits:

- Hours 24h: clamp 0–23
- Hours 12h: clamp 1–12
- Minutes / Seconds: clamp 0–59

If the field is empty, `pad` is a no-op (partial state is allowed).

### Arrow key stepping

`step(field, dir)` wraps around within the valid range. Hours use `(val - min + dir + range) % range + min` to handle the 1-based 12h range correctly.

## Registry workflow

The component is distributed as a shadcn registry item. Users install it with:

```bash
npx shadcn@latest add https://your-domain.com/r/time-input.json
```

`public/r/time-input.json` is a static file containing the component source inlined as a string. It is generated — not hand-edited — by:

```bash
npm run registry:build
# runs scripts/build-registry.ts via tsx
```

The script reads `src/components/ui/time-input.tsx` verbatim and writes the registry item JSON. When deploying, set `NEXT_PUBLIC_URL` (e.g. `https://time-input.yourdomain.com`) so the install command displayed on the docs page uses the real URL instead of localhost.

## What to keep stable

- The `value`/`onChange` contract: always 24h format, empty string while incomplete
- `serialize` always returning 24h regardless of `format` prop — this is intentional and documented
- The `lastEmitted` pattern — changing to a naive `useEffect` that always syncs from `value` will break mid-type controlled usage
- `public/r/time-input.json` must be regenerated after any component change

## What is intentionally absent

- No Radix UI dependency — the component doesn't need a primitive
- No `w-full` default on the wrapper — time inputs are naturally narrow; users add `className="w-full"` when needed
- No validation feedback / error state — left to the consuming application via `className`
- `format` is not expected to change dynamically; if it does, pass a new `key` to force remount
