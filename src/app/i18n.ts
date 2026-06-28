export type Locale = "en" | "ja"

export type Strings = {
  htmlLang: string

  // Header
  badge: string
  langEn: string
  langJa: string

  // Section titles
  sectionWhy: string
  sectionInstall: string
  sectionLiveDemo: string
  sectionVariants: string
  sectionLocalization: string
  sectionScrollToStep: string
  sectionSizes: string
  sectionUsage: string
  sectionKeyboard: string
  sectionProps: string

  // Interactive demo
  demo24h: string
  demo12h: string
  demoWithSeconds: string
  demoValueLabel: string

  // Variant row labels
  variantDefault24h: string
  variantFormat12h: string
  variantWithSeconds: string
  variant12hSeconds: string
  variantCustomPlaceholder: string
  variantAutofillMinutes: string
  variantRoundNearest: string
  variantRoundFloor: string
  variantRoundCeil: string
  variantAvoidRollover: string
  variantOverflow27: string
  variantAllow24: string
  variantDisabled: string
  variantUnitSuffixes: string
  variantUnitSuffixesEn: string

  // Scroll to step demo
  scrollOff: string
  scrollOn: string

  // Keyboard table rows
  keyRows: [string, string][]

  // Props table columns
  colProp: string
  colType: string
  colDefault: string

  // Feature card titles (features.tsx)
  featZeroPadTitle: string
  featRoundingTitle: string
  featCjkTitle: string
  featOverflowTitle: string
  featShadcnTitle: string
  feat24hOutputTitle: string
  featTestingTitle: string

  // CJK section heading
  cjkHeading: string

  // Comparison table
  compFeature: string
  compOtherPickers: string
  compYes: string
  compNo: string
  compSystem: string
  compVaries: string
  compRows: string[]
}

const en: Strings = {
  htmlLang: "en",
  badge: "registry:ui",
  langEn: "EN",
  langJa: "日本語",

  sectionWhy: "Why time-input?",
  sectionInstall: "Install",
  sectionLiveDemo: "Live demo",
  sectionVariants: "Variants",
  sectionLocalization: "Localization",
  sectionScrollToStep: "Scroll to step",
  sectionSizes: "Sizes",
  sectionUsage: "Usage",
  sectionKeyboard: "Keyboard",
  sectionProps: "Props",

  demo24h: "24-hour",
  demo12h: "12-hour",
  demoWithSeconds: "With seconds",
  demoValueLabel: "value",

  variantDefault24h: "Default (24h)",
  variantFormat12h: "12-hour",
  variantWithSeconds: "With seconds",
  variant12hSeconds: "12h + seconds",
  variantCustomPlaceholder: "Custom placeholder",
  variantAutofillMinutes: "Autofill minutes",
  variantRoundNearest: "Round nearest",
  variantRoundFloor: "Round floor",
  variantRoundCeil: "Round ceiling",
  variantAvoidRollover: "Avoid day rollover",
  variantOverflow27: "Overflow hours (max 27)",
  variantAllow24: "Allow 24:00 only",
  variantDisabled: "Disabled",
  variantUnitSuffixes: "Unit suffixes (時 分 秒)",
  variantUnitSuffixesEn: "Unit suffixes (h m s)",

  scrollOff: "Off (default)",
  scrollOn: "On",

  keyRows: [
    ["↑ / ↓", "Increment or decrement the focused segment"],
    ["Tab", "Move to the next segment"],
    ["Shift+Tab", "Move to the previous segment"],
    ["Backspace on empty", "Jump focus back to previous segment"],
    ["Space / ↑ / ↓ on AM/PM", "Toggle between AM and PM"],
  ],

  colProp: "Prop",
  colType: "Type",
  colDefault: "Default",

  featZeroPadTitle: "Zero-pad on blur",
  featRoundingTitle: "Minute rounding",
  featCjkTitle: "CJK input method normalization",
  featOverflowTitle: "Overflow hours",
  featShadcnTitle: "shadcn/ui native",
  feat24hOutputTitle: "Consistent 24h output",
  featTestingTitle: "117 tests, 0 surprises",

  cjkHeading: "How CJK normalization works",

  compFeature: "Feature",
  compOtherPickers: "Other pickers",
  compYes: "Yes",
  compNo: "No",
  compSystem: "system",
  compVaries: "varies",
  compRows: [
    "shadcn/ui tokens",
    "Zero-pad on blur",
    "Minute rounding",
    "CJK normalization",
    "Overflow hours",
    "12h + 24h display",
    "Consistent 24h output",
    "Single-file install",
    "No extra dependencies",
    "Test coverage",
  ],
}

const ja: Strings = {
  htmlLang: "ja",
  badge: "registry:ui",
  langEn: "EN",
  langJa: "日本語",

  sectionWhy: "なぜtime-inputなのか",
  sectionInstall: "インストール",
  sectionLiveDemo: "ライブデモ",
  sectionVariants: "バリアント",
  sectionLocalization: "ローカライゼーション",
  sectionScrollToStep: "スクロールで値を変更",
  sectionSizes: "サイズ",
  sectionUsage: "使い方",
  sectionKeyboard: "キーボード操作",
  sectionProps: "プロパティ",

  demo24h: "24時間",
  demo12h: "12時間",
  demoWithSeconds: "秒あり",
  demoValueLabel: "値",

  variantDefault24h: "デフォルト（24時間）",
  variantFormat12h: "12時間",
  variantWithSeconds: "秒あり",
  variant12hSeconds: "12時間＋秒",
  variantCustomPlaceholder: "カスタムプレースホルダー",
  variantAutofillMinutes: "分の自動入力",
  variantRoundNearest: "最近傍に丸め",
  variantRoundFloor: "切り捨て",
  variantRoundCeil: "切り上げ",
  variantAvoidRollover: "日付またぎを防止",
  variantOverflow27: "オーバーフロー時間（最大27）",
  variantAllow24: "24:00のみ許可",
  variantDisabled: "無効",
  variantUnitSuffixes: "単位サフィックス（時 分 秒）",
  variantUnitSuffixesEn: "単位サフィックス（h m s）",

  scrollOff: "オフ（デフォルト）",
  scrollOn: "オン",

  keyRows: [
    ["↑ / ↓", "フォーカス中のセグメントの値を増減"],
    ["Tab", "次のセグメントへ移動"],
    ["Shift+Tab", "前のセグメントへ移動"],
    ["空欄でBackspace", "前のセグメントにフォーカスを戻す"],
    ["AM/PMでSpace / ↑ / ↓", "AM/PMを切り替え"],
  ],

  colProp: "プロパティ",
  colType: "型",
  colDefault: "デフォルト",

  featZeroPadTitle: "ブラー時の自動ゼロ埋め",
  featRoundingTitle: "分の丸め処理",
  featCjkTitle: "CJK入力メソッドの正規化",
  featOverflowTitle: "オーバーフロー時間",
  featShadcnTitle: "shadcn/uiネイティブ",
  feat24hOutputTitle: "一貫した24時間形式の出力",
  featTestingTitle: "117テスト、0サプライズ",

  cjkHeading: "CJK正規化の仕組み",

  compFeature: "機能",
  compOtherPickers: "他のピッカー",
  compYes: "あり",
  compNo: "なし",
  compSystem: "システム依存",
  compVaries: "まちまち",
  compRows: [
    "shadcn/uiトークン",
    "ブラー時のゼロ埋め",
    "分の丸め処理",
    "CJK正規化",
    "オーバーフロー時間",
    "12時間・24時間表示",
    "一貫した24時間出力",
    "単一ファイルインストール",
    "追加依存なし",
    "テストカバレッジ",
  ],
}

export const strings: Record<Locale, Strings> = { en, ja }
