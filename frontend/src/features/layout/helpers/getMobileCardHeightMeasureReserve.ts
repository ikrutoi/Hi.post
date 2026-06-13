/** Extra px to subtract from mobile form height before sizing the card preview. */
export function getMobileCardHeightMeasureReserve(
  remSize: number,
  viewportHeight: number,
): number {
  const baseReserveRem = 0.1
  const shortViewportBoostRem =
    viewportHeight <= 640 ? 0.2 : viewportHeight <= 700 ? 0.1 : 0

  return remSize * (baseReserveRem + shortViewportBoostRem)
}
