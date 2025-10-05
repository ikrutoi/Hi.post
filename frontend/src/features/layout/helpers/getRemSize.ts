export const getRemSize = (): number => {
  const root = document.documentElement
  const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
  const tempDiv = document.createElement('div')
  tempDiv.style.width = remSizeInPx
  tempDiv.style.visibility = 'hidden'
  document.body.appendChild(tempDiv)
  const computedRem = tempDiv.getBoundingClientRect().width
  document.body.removeChild(tempDiv)
  return computedRem
}
