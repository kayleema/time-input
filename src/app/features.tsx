"use client"

import * as React from "react"
import { useLocale } from "./locale-provider"
import { strings } from "./i18n"

function FeatureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <p className="mb-1.5 text-xs font-semibold tracking-wide">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

function C({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1 font-mono text-xs">{children}</code>
}

// Comparison table data: [native, otherPickers, timeInput]
const compData: [boolean | "system" | "varies", boolean | "system" | "varies", boolean][] = [
  [false, false, true],
  [false, "varies", true],
  [false, false, true],
  [false, false, true],
  [false, false, true],
  ["system", "varies", true],
  [false, "varies", true],
  [false, false, true],
  [true, false, true],
]

export function WhySection() {
  const { locale } = useLocale()
  const s = strings[locale]

  return (
    <div className="flex flex-col gap-6">

      {/* Motivation */}
      {locale === "ja" ? (
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            ネイティブの <C>&lt;input type="time"&gt;</C> はスタイリングがほぼ不可能で、ブラウザおよびOS間で動作が一致せず、書式設定のためのJavaScript
            APIも提供されていません。ChromeとFirefoxではフォーカスの自動移動が異なり、デザイントークンを無視したブラウザ独自のピッカーを表示し、丸め・ゼロ埋め・オーバーフロー時間の仕組みもありません。
          </p>
          <p>
            既存のサードパーティ製タイムピッカーはいくつかの問題を解決しますが、独自のデザインシステムを持ち込むため shadcn/ui
            のトークンに合わせるにはオーバーライドが必要です。また、CJK入力メソッドが生成する全角数字を正しく処理できるものはありません。このコンポーネントは
            shadcn レジストリ経由で単一ファイルとしてインストールでき、プロジェクト内の既存のCSS変数のみを使用します。
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The native <C>&lt;input type="time"&gt;</C> is nearly impossible to style, behaves
            inconsistently across browsers and operating systems, and exposes no JavaScript API for
            formatting. It auto-advances focus differently in Chrome versus Firefox, renders a
            browser-native picker that ignores your design tokens, and provides no mechanism for
            rounding, zero-filling, or overflow hours.
          </p>
          <p>
            Existing third-party time pickers solve some of these problems but introduce their own
            design systems — requiring overrides to match shadcn/ui tokens — and none handle the
            full-width digit output produced by CJK input methods. This component installs as a
            single file via the shadcn registry and uses only the CSS variables already in your
            project.
          </p>
        </div>
      )}

      {/* Feature grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {locale === "ja" ? (
          <>
            <FeatureCard title={s.featZeroPadTitle}>
              ユーザーが <C>9</C> と入力してタブキーを押すと、<C>9</C> ではなく <C>09:00</C>{" "}
              が返されます。ネイティブ入力にはこの機能がなく、一般的なReact製タイムピッカーも同様です。
            </FeatureCard>

            <FeatureCard title={s.featRoundingTitle}>
              ブラー時に設定した間隔で丸め処理を行います — <C>nearest</C>（最近傍）、<C>floor</C>（切り捨て）、
              <C>ceil</C>（切り上げ）の3モードに対応。<C>roundLastIntervalDown</C> を設定すると{" "}
              <C>23:55</C> を超えないよう処理されるため、スケジューリングUIで誤って翌日に進む心配がありません。
            </FeatureCard>

            <FeatureCard title={s.featCjkTitle}>
              日本語・中国語・韓国語のIMEはASCIIの数字ではなく全角数字（１、２…）を出力することが多くあります。このコンポーネントはすべての入力をNFKCで正規化してから数字を抽出するため、母国語の入力メソッドを使うユーザーもUSキーボードのユーザーと同じようにシームレスに操作できます。
            </FeatureCard>

            <FeatureCard title={s.featOverflowTitle}>
              <C>27:00</C> のような値（放送スケジュール・シフト管理・翌日の時間追跡などで一般的）を完全サポート。
              <C>maxOverflowHours</C>{" "}
              で上限を設定でき、丸め処理もオーバーフローを考慮するため、27時間の値が誤って00:00に戻ることはありません。
            </FeatureCard>

            <FeatureCard title={s.featShadcnTitle}>
              単一のソースファイルとしてshadcnレジストリから配布されます。<C>--border</C>、<C>--input</C>、
              <C>--ring</C>{" "}
              など、プロジェクトの既存CSS変数を追加設定なしで読み込みます。ダークモード、角丸、ブランドカラーは自動的に継承されます。
            </FeatureCard>

            <FeatureCard title={s.feat24hOutputTitle}>
              12時間表示が有効でも、<C>value</C> / <C>onChange</C> は常に <C>HH:mm</C> または{" "}
              <C>HH:mm:ss</C>{" "}
              の24時間形式です。フォーム・バリデーションライブラリ・サーバー側のハンドラーはAM/PMを解析することなく、一貫した文字列を受け取ります。
            </FeatureCard>
          </>
        ) : (
          <>
            <FeatureCard title={s.featZeroPadTitle}>
              When a user types <C>9</C> and tabs away the component emits <C>09:00</C>, not a bare{" "}
              <C>9</C>. The native input does not do this. Neither does any commonly-used React time
              picker.
            </FeatureCard>

            <FeatureCard title={s.featRoundingTitle}>
              Rounds to the nearest configurable interval on blur — with three modes:{" "}
              <C>nearest</C>, <C>floor</C>, and <C>ceil</C>. Day-boundary awareness prevents rolling
              past <C>23:55</C> when <C>roundLastIntervalDown</C> is set, so scheduling UIs never
              accidentally advance to the next calendar day.
            </FeatureCard>

            <FeatureCard title={s.featCjkTitle}>
              Japanese, Chinese, and Korean IMEs routinely emit full-width digits (１, ２, …) instead
              of ASCII digits. The component normalizes all input through NFKC before extracting
              digits, so users typing in their native input method see the same seamless experience as
              those on a US keyboard.
            </FeatureCard>

            <FeatureCard title={s.featOverflowTitle}>
              Values like <C>27:00</C> — common in broadcast scheduling, shift planning, and
              next-day time tracking — are fully supported. <C>maxOverflowHours</C> caps the range,
              and rounding is overflow-aware so it will not accidentally roll a 27-hour value back to
              00:00.
            </FeatureCard>

            <FeatureCard title={s.featShadcnTitle}>
              Distributed through the shadcn registry as a single source file. It reads{" "}
              <C>--border</C>, <C>--input</C>, <C>--ring</C>, and the rest of your existing CSS
              variables with no additional configuration. Dark mode, radius, and brand colors are
              inherited automatically.
            </FeatureCard>

            <FeatureCard title={s.feat24hOutputTitle}>
              The <C>value</C> / <C>onChange</C> contract is always <C>HH:mm</C> or{" "}
              <C>HH:mm:ss</C> in 24-hour format, regardless of whether 12h display is active. Forms,
              validation libraries, and server handlers receive a predictable string and never need to
              parse AM/PM.
            </FeatureCard>
          </>
        )}
      </div>

      {/* CJK deep-dive */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {s.cjkHeading}
        </h3>
        <div className="flex flex-col gap-2 text-xs leading-relaxed text-muted-foreground">
          {locale === "ja" ? (
            <>
              <p>
                Unicodeの「半角・全角形」ブロック（U+FF00〜U+FFEF）には、すべてのASCII文字の全角バリアントが含まれています。日本語IMEは、多くのシステムで数字入力のデフォルトとなっている全角入力モード時にこれらを使用します。数字{" "}
                <C>０１２３４５６７８９</C>（U+FF10〜U+FF19）は通常の数字のように見えますが、異なるコードポイントであり、多くの入力フィールドでは暗黙的に拒否されるか誤動作します。
              </p>
              <p>
                NFKC（互換分解とその後の正規合成）は、4つのUnicode正規化形式のひとつです。互換文字を正規の等価文字に変換します
                — 全角数字はASCII数字に、<C>¹²</C>（U+00B9、U+00B2）などの上付き文字は <C>12</C>{" "}
                に、<C>ﬁ</C> などの合字は <C>fi</C> に変換されます。内部の <C>getDigits</C>{" "}
                ヘルパーは、数字以外を除去する前に毎回のキー入力値をこの変換にかけます。
              </p>
            </>
          ) : (
            <>
              <p>
                Unicode's "Halfwidth and Fullwidth Forms" block (U+FF00–U+FFEF) contains full-width
                variants of every ASCII character. Japanese IMEs use these when the user is in
                full-width input mode — the common default for number entry on many systems. The
                digits <C>０１２３４５６７８９</C> (U+FF10–U+FF19) look like regular numbers but are
                distinct code points that most inputs silently reject or mishandle.
              </p>
              <p>
                NFKC (Compatibility Decomposition followed by Canonical Composition) is one of four
                Unicode normalization forms. It maps compatibility characters to their canonical
                equivalents — full-width digits become ASCII digits, superscripts like <C>¹²</C>{" "}
                (U+00B9, U+00B2) become <C>12</C>, and ligatures like <C>ﬁ</C> become <C>fi</C>.
                The internal <C>getDigits</C> helper runs every keystroke's value through this
                transform before stripping non-digits:
              </p>
            </>
          )}
        </div>
        <pre className="overflow-x-auto rounded border border-border bg-background px-4 py-3 text-xs leading-relaxed">
          <code>{`function getDigits(raw: string) {
  return raw
    .normalize("NFKC")   // "１４" → "14",  "¹²" → "12"
    .replace(/\\D/g, "")  // strip anything that isn't 0–9
    .slice(-2)            // keep last 2 digits (handles IME composing state)
}`}</code>
        </pre>
        {locale === "ja" ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <C>.slice(-2)</C> はIMEの変換中に特に重要です。変換中、入力値には変換前の文字列に部分変換された文字が一時的に連結されることがあります。末尾の2文字を取得することで、<C>compositionstart</C> や <C>compositionend</C>{" "}
            イベントを明示的に追跡せずに、確定された数字が常に正しく処理されます。
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground">
            The <C>.slice(-2)</C> is specifically important for IME composing state: while an IME is
            mid-composition the input's value may temporarily contain the partially-composed string
            concatenated with the prior value. Taking the last two characters ensures the committed
            digit always wins without needing to track composing events explicitly.
          </p>
        )}
      </div>

      {/* Comparison table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-2.5 text-left font-semibold">{s.compFeature}</th>
              <th className="px-4 py-2.5 text-center font-semibold">
                <C>type="time"</C>
              </th>
              <th className="px-4 py-2.5 text-center font-semibold">{s.compOtherPickers}</th>
              <th className="px-4 py-2.5 text-center font-semibold">time-input</th>
            </tr>
          </thead>
          <tbody>
            {s.compRows.map((feature, i) => (
              <tr key={feature} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground">{feature}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(compData[i][0], s)}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(compData[i][1], s)}</td>
                <td className="px-4 py-2.5 text-center">{renderCell(compData[i][2], s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

function renderCell(value: boolean | "system" | "varies", s: typeof strings["en"]) {
  if (value === true) return <span className="font-semibold text-foreground">{s.compYes}</span>
  if (value === false) return <span className="text-muted-foreground/50">{s.compNo}</span>
  if (value === "system") return <span className="text-muted-foreground">{s.compSystem}</span>
  return <span className="text-muted-foreground">{s.compVaries}</span>
}
