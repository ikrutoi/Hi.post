export function getNextAddressBookGridIndex(
  key: string,
  currentIndex: number,
  length: number,
  columns: number,
): number | null {
  if (length === 0 || columns < 1) return null

  if (key === 'ArrowRight') {
    if (currentIndex < 0) return 0
    return Math.min(currentIndex + 1, length - 1)
  }
  if (key === 'ArrowLeft') {
    if (currentIndex < 0) return 0
    return Math.max(currentIndex - 1, 0)
  }
  if (key === 'ArrowDown') {
    if (currentIndex < 0) return 0
    return Math.min(currentIndex + columns, length - 1)
  }
  if (key === 'ArrowUp') {
    if (currentIndex < 0) return 0
    return Math.max(currentIndex - columns, 0)
  }

  return null
}
