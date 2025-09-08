export const updateClipPath = (
  overlayRef: HTMLElement | null,
  x: number,
  y: number,
  width: number,
  height: number
): void => {
  if (!overlayRef) return

  overlayRef.style.clipPath = `polygon(
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 ${y}px,
    ${x}px ${y}px,
    ${x}px ${y + height}px,
    ${x + width}px ${y + height}px,
    ${x + width}px ${y}px,
    0 ${y}px
  )`
}
