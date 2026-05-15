import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const root = process.cwd()

const content = readFileSync(
  join(root, "src/components/ui/time-input.tsx"),
  "utf-8"
)

const item = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "time-input",
  type: "registry:ui",
  title: "Time Input",
  description:
    "Flexible time input with auto zero-padding, 12/24h format, AM/PM toggle, and optional seconds. Compatible with shadcn/ui and React Hook Form.",
  dependencies: ["class-variance-authority"],
  registryDependencies: ["utils"],
  files: [
    {
      path: "components/ui/time-input.tsx",
      content,
      type: "registry:ui",
      target: "",
    },
  ],
  tailwind: {},
  cssVars: {},
}

const outPath = join(root, "public/r/time-input.json")
writeFileSync(outPath, JSON.stringify(item, null, 2))
console.log(`Registry item written to ${outPath}`)
