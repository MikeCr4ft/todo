/**
 * Pure positioning functions for float-based ordered lists.
 * No I/O, no framework dependencies — safe to unit-test without a database.
 */

/** Position for an item appended to the end of a list. */
export function calcAppendPosition(last: number | null): number {
  return last === null ? 1.0 : last + 1.0
}

/**
 * Position for an item inserted between two neighbours.
 * Pass null for above/below when inserting at the very start or end.
 */
export function calcInsertPosition(
  above: number | null,
  below: number | null
): number {
  if (above === null && below === null) return 1.0
  if (above === null) return below! / 2       // Before the first item
  if (below === null) return above + 1.0      // After the last item
  return (above + below) / 2                 // Midpoint between neighbours
}
