/**
 * addressNext: overview (null) → first applied id → … → last → overview.
 * Overview is the Recipients count (all minis); an id focuses that address’s pies.
 */
export function nextFocusedRecipientSlotKey(
  appliedIds: string[],
  current: string | null,
): string | null {
  if (appliedIds.length <= 1) return current
  if (current == null) return appliedIds[0] ?? null
  const index = appliedIds.indexOf(current)
  if (index < 0) return appliedIds[0] ?? null
  if (index >= appliedIds.length - 1) return null
  return appliedIds[index + 1] ?? null
}
