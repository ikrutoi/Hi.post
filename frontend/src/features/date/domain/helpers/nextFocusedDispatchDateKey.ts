/**
 * dateNext: overview (null) → first send day → … → last → overview.
 * Overview is the Dates count (all minis); a key focuses pies that share that day.
 */
export function nextFocusedDispatchDateKey(
  dateKeys: string[],
  current: string | null,
): string | null {
  if (dateKeys.length <= 1) return current
  if (current == null) return dateKeys[0] ?? null
  const index = dateKeys.indexOf(current)
  if (index < 0) return dateKeys[0] ?? null
  if (index >= dateKeys.length - 1) return null
  return dateKeys[index + 1] ?? null
}
