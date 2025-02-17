export const updateClipPath = (overlayRef, x, y, width, height) => {
  if (overlayRef) {
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
}
