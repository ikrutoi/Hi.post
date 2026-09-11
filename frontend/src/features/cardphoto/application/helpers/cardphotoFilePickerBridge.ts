type TrackCancelFn = () => void

let input: HTMLInputElement | null = null
let trackCancelFn: TrackCancelFn | null = null
let openedFromGestureAt = 0
let cancelGeneration = 0

const RECENT_OPEN_MS = 500

export function registerCardphotoFilePicker(
  el: HTMLInputElement,
  trackCancel: TrackCancelFn,
) {
  input = el
  trackCancelFn = trackCancel
}

export function unregisterCardphotoFilePicker() {
  input = null
  trackCancelFn = null
}

export function getCardphotoFilePickerCancelGeneration(): number {
  return cancelGeneration
}

export function invalidateCardphotoFilePickerCancelWatchers() {
  cancelGeneration += 1
}

export function wasCardphotoFilePickerOpenedRecently(): boolean {
  return Date.now() - openedFromGestureAt < RECENT_OPEN_MS
}

export function openCardphotoFilePickerFromUserGesture(): boolean {
  if (!input) return false

  invalidateCardphotoFilePickerCancelWatchers()
  input.value = ''
  trackCancelFn?.()
  input.click()
  openedFromGestureAt = Date.now()
  return true
}

/** Fallback when saga dispatches openFileDialog (async reopen / IDB paths). */
export function openCardphotoFilePickerFromAction(): boolean {
  if (wasCardphotoFilePickerOpenedRecently()) return false
  return openCardphotoFilePickerFromUserGesture()
}
