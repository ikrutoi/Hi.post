export const getRemSize = (): number => {
  const rootFontSize = getComputedStyle(document.documentElement).fontSize
  return parseFloat(rootFontSize)
}
