/**
 * Peek / list dateEdit for cartBlocked: claim while calendar date-pick should stay on.
 * Survives transient `cartCalendarDatePickMode` clears (sagas / panel chrome).
 */
let listEntryOwned = false

export function claimCartDatePickListEntryOwnership(): void {
  listEntryOwned = true
}

export function releaseCartDatePickListEntryOwnership(): void {
  listEntryOwned = false
}

export function isCartDatePickListEntryOwned(): boolean {
  return listEntryOwned
}
