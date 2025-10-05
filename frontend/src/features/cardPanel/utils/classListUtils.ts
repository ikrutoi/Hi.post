export function addClassIfMissing(
  ref: HTMLElement | null,
  className: string
): void {
  if (ref && !ref.classList.contains(className)) {
    ref.classList.add(className)
  }
}

export function removeClassIfPresent(
  ref: HTMLElement | null,
  className: string
): void {
  if (ref && ref.classList.contains(className)) {
    ref.classList.remove(className)
  }
}

export function toggleClass(
  ref: HTMLElement | null,
  className: string,
  state: boolean
): void {
  if (!ref) return
  ref.classList.toggle(className, state)
}

export function setPolyCardClass(
  ref: HTMLElement | null,
  isFull: boolean
): void {
  if (!ref) return
  toggleClass(ref, 'full', isFull)
  toggleClass(ref, 'full-fade-out', !isFull)
}

export function setArrowsFull(ref: HTMLElement | null): void {
  setTimeout(() => {
    addClassIfMissing(ref, 'full')
  }, 0)
}
