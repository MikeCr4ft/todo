import { describe, it, expect } from "vitest"
import { calcInsertPosition, calcAppendPosition } from "@/lib/position-calculator"

describe("calcAppendPosition", () => {
  it("returns 1.0 when the list is empty", () => {
    expect(calcAppendPosition(null)).toBe(1.0)
  })

  it("returns last + 1 when appending to a non-empty list", () => {
    expect(calcAppendPosition(3.0)).toBe(4.0)
    expect(calcAppendPosition(0.5)).toBe(1.5)
  })
})

describe("calcInsertPosition", () => {
  it("returns 1.0 when both neighbours are null (empty list)", () => {
    expect(calcInsertPosition(null, null)).toBe(1.0)
  })

  it("inserts before the first item (no upper neighbour)", () => {
    expect(calcInsertPosition(null, 2.0)).toBe(1.0)
    expect(calcInsertPosition(null, 1.0)).toBe(0.5)
  })

  it("inserts after the last item (no lower neighbour)", () => {
    expect(calcInsertPosition(3.0, null)).toBe(4.0)
    expect(calcInsertPosition(1.5, null)).toBe(2.5)
  })

  it("inserts between two cards using their midpoint", () => {
    expect(calcInsertPosition(1.0, 3.0)).toBe(2.0)
    expect(calcInsertPosition(2.0, 4.0)).toBe(3.0)
    expect(calcInsertPosition(1.0, 2.0)).toBe(1.5)
  })

  it("handles very close float values without colliding", () => {
    const a = 1.0
    const b = 1.0 + Number.EPSILON * 4
    const mid = calcInsertPosition(a, b)
    expect(mid).toBeGreaterThan(a)
    expect(mid).toBeLessThan(b)
  })

  it("repeated insertions at the start produce strictly decreasing positions", () => {
    let below = 1.0
    for (let i = 0; i < 10; i++) {
      const pos = calcInsertPosition(null, below)
      expect(pos).toBeLessThan(below)
      below = pos
    }
  })

  it("repeated insertions between two cards produce positions within the bounds", () => {
    let above = 1.0
    let below = 2.0
    for (let i = 0; i < 10; i++) {
      const mid = calcInsertPosition(above, below)
      expect(mid).toBeGreaterThan(above)
      expect(mid).toBeLessThan(below)
      above = mid
    }
  })
})
