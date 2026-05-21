import { codeToHtml } from "shiki"

export async function CodeBlock({ children, lang = "tsx" }: { children: string; lang?: string }) {
  const html = await codeToHtml(children, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })

  return (
    <div
      className="overflow-x-auto rounded-lg border border-border text-xs [&>pre]:px-4 [&>pre]:py-3 [&>pre]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
