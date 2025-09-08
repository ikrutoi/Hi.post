export const calculateMaxCardsList = (
  containerWidth: number,
  remSize: number,
  miniCardHeight: number
): number => {
  const miniCardWidth = Number((miniCardHeight * 1.42).toFixed(2))
  return Math.floor(
    (containerWidth - 2 * remSize) / (miniCardWidth + 1.2 * remSize)
  )
}
