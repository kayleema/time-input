import { test, expect, type Locator, type Page } from "@playwright/test"

function fixture(page: Page, id: string) {
  const root = page.getByTestId(id)
  return {
    root,
    hours: root.getByRole("textbox", { name: "Hours" }),
    minutes: root.getByRole("textbox", { name: "Minutes" }),
    seconds: root.getByRole("textbox", { name: "Seconds" }),
    period: root.getByRole("button", { name: /Toggle period/ }),
    before: root.getByRole("textbox", { name: "before" }),
    after: root.getByRole("textbox", { name: "after" }),
    value: root.getByTestId("value"),
  }
}

async function expectFullySelected(input: Locator) {
  await expect(input).toBeFocused()
  const sel = await input.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd, el.value.length])
  expect(sel[0]).toBe(0)
  expect(sel[1]).toBe(sel[2])
}

test.beforeEach(async ({ page }) => {
  await page.goto("/e2e")
})

test.describe("overwriting an existing time", () => {
  test("clicking hours and typing two digits replaces hours and selects minutes", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.hours.click()
    await page.keyboard.type("14")
    await expect(t.hours).toHaveValue("14")
    await expect(t.value).toHaveText("14:30")
    await expectFullySelected(t.minutes)
  })

  test("typing four digits overwrites hours then minutes, focus stays on minutes", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.hours.click()
    await page.keyboard.type("1445")
    await expect(t.value).toHaveText("14:45")
    await expect(t.minutes).toBeFocused()
  })

  test("a single auto-advancing digit replaces hours and selects minutes", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.hours.click()
    await page.keyboard.type("7")
    await expect(t.value).toHaveText("07:30")
    await expectFullySelected(t.minutes)
  })

  test("clicking at the end of the hours text still replaces rather than appends", async ({ page }) => {
    const t = fixture(page, "h24")
    const box = (await t.hours.boundingBox())!
    await page.mouse.click(box.x + box.width - 2, box.y + box.height / 2)
    await page.keyboard.type("1")
    await expect(t.hours).toHaveValue("1")
    await page.keyboard.type("5")
    await expect(t.value).toHaveText("15:30")
    await expectFullySelected(t.minutes)
  })

  test("double-clicking minutes and retyping keeps focus on minutes", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.minutes.dblclick()
    await page.keyboard.type("05")
    await expect(t.value).toHaveText("09:05")
    await expect(t.minutes).toBeFocused()
  })

  test("typing more digits into a complete last segment starts it over", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.minutes.click()
    await page.keyboard.type("4512")
    await expect(t.value).toHaveText("09:12")
    await expect(t.minutes).toBeFocused()
  })

  test("arrow-stepping then typing replaces the stepped value", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.hours.click()
    await page.keyboard.press("ArrowUp")
    await expect(t.value).toHaveText("10:30")
    await page.keyboard.type("8")
    await expect(t.value).toHaveText("08:30")
    await expectFullySelected(t.minutes)
  })

  test("select-all then typing rewrites the whole time", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.minutes.click()
    await page.keyboard.press("ControlOrMeta+a")
    await page.keyboard.type("1205")
    await expect(t.value).toHaveText("12:05")
    await expect(t.minutes).toBeFocused()
  })
})

test.describe("focus never leaves the control while typing", () => {
  test("empty: typing a full time walks hours → minutes and stays", async ({ page }) => {
    const t = fixture(page, "empty")
    await t.hours.click()
    await page.keyboard.type("0930")
    await expect(t.value).toHaveText("09:30")
    await expect(t.minutes).toBeFocused()
  })

  test("Tab from the previous field selects hours; Tab after typing moves to the next field", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.before.click()
    await page.keyboard.press("Tab")
    await expectFullySelected(t.hours)
    await page.keyboard.type("1445")
    await expect(t.minutes).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(t.after).toBeFocused()
    await expect(t.value).toHaveText("14:45")
  })

  test("overwriting only hours then Tab keeps minutes and leaves the control", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.hours.click()
    await page.keyboard.type("14")
    await page.keyboard.press("Tab")
    await expect(t.after).toBeFocused()
    await expect(t.value).toHaveText("14:30")
  })

  test("Shift+Tab from minutes selects hours for overwrite", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.minutes.click()
    await page.keyboard.press("Shift+Tab")
    await expectFullySelected(t.hours)
    await page.keyboard.type("18")
    await expect(t.value).toHaveText("18:30")
    await expectFullySelected(t.minutes)
  })

  test("seconds: hours → minutes → seconds, each selected, focus stays on seconds", async ({ page }) => {
    const t = fixture(page, "seconds")
    await t.hours.click()
    await page.keyboard.type("10")
    await expectFullySelected(t.minutes)
    await page.keyboard.type("20")
    await expectFullySelected(t.seconds)
    await page.keyboard.type("40")
    await expect(t.value).toHaveText("10:20:40")
    await expect(t.seconds).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(t.after).toBeFocused()
  })

  test("12h: overwrite hours, minutes, land on the period toggle, then Tab out", async ({ page }) => {
    const t = fixture(page, "h12")
    await t.hours.click()
    await page.keyboard.type("11")
    await expectFullySelected(t.minutes)
    await page.keyboard.type("15")
    await expect(t.period).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(t.value).toHaveText("23:15")
    await page.keyboard.press("Tab")
    await expect(t.after).toBeFocused()
  })

  test("Backspace through minutes returns to hours, selected for overwrite", async ({ page }) => {
    const t = fixture(page, "h24")
    await t.minutes.click()
    await page.keyboard.press("Backspace")
    await expect(t.minutes).toHaveValue("")
    await page.keyboard.press("Backspace")
    await expectFullySelected(t.hours)
    await page.keyboard.type("1")
    await expect(t.hours).toHaveValue("1")
  })

  test("controlled parent: overwrite flows through value/onChange with focus intact", async ({ page }) => {
    const t = fixture(page, "controlled")
    await t.hours.click()
    await page.keyboard.type("16")
    await expectFullySelected(t.minutes)
    await page.keyboard.type("05")
    await expect(t.value).toHaveText("16:05")
    await expect(t.minutes).toBeFocused()
  })

  test("parent that remounts on blur does not steal focus mid-entry", async ({ page }) => {
    const t = fixture(page, "remount")
    await t.hours.click()
    await page.keyboard.type("1445")
    await expect(t.minutes).toBeFocused()
    await expect(t.hours).toHaveValue("14")
    await expect(t.minutes).toHaveValue("45")
    await expect(t.value).toHaveText("09:30")
    await page.keyboard.press("Tab")
    await expect(t.value).toHaveText("14:45")
  })
})
