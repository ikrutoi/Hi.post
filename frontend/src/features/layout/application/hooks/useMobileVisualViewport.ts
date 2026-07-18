import { useLayoutEffect, type RefObject } from 'react'

const KEYBOARD_OPEN_THRESHOLD_PX = 48

function readVisualViewportInsets() {
  const viewport = window.visualViewport
  if (!viewport) {
    return {
      height: window.innerHeight,
      offsetTop: 0,
      keyboardInset: 0,
      keyboardOpen: false,
    }
  }

  const height = viewport.height
  const offsetTop = viewport.offsetTop
  const keyboardInset = Math.max(
    0,
    Math.round(window.innerHeight - height - offsetTop),
  )

  return {
    height,
    offsetTop,
    keyboardInset,
    keyboardOpen: keyboardInset >= KEYBOARD_OPEN_THRESHOLD_PX,
  }
}

export type UseMobileVisualViewportOptions = {
  /**
   * Keep shell `top` at 0 (e.g. envelope address create).
   * Avoids the form jumping down when the keyboard closes / viewport offset resets.
   */
  pinTop?: boolean
}

/** Keeps mobile shell within the visual viewport when the on-screen keyboard opens. */
export function useMobileVisualViewport(
  shellRef: RefObject<HTMLElement | null>,
  options?: UseMobileVisualViewportOptions,
) {
  const pinTop = options?.pinTop === true

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell || !window.visualViewport) return

    const apply = () => {
      const { height, offsetTop, keyboardInset, keyboardOpen } =
        readVisualViewportInsets()

      shell.style.setProperty('--mobile-vv-height', `${height}px`)
      shell.style.setProperty(
        '--mobile-vv-offset-top',
        `${pinTop ? 0 : offsetTop}px`,
      )
      shell.style.setProperty('--mobile-keyboard-inset', `${keyboardInset}px`)
      shell.dataset.keyboardOpen = keyboardOpen ? 'true' : 'false'
    }

    apply()

    const viewport = window.visualViewport
    viewport.addEventListener('resize', apply)
    viewport.addEventListener('scroll', apply)
    window.addEventListener('resize', apply)

    return () => {
      viewport.removeEventListener('resize', apply)
      viewport.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
      shell.style.removeProperty('--mobile-vv-height')
      shell.style.removeProperty('--mobile-vv-offset-top')
      shell.style.removeProperty('--mobile-keyboard-inset')
      delete shell.dataset.keyboardOpen
    }
  }, [shellRef, pinTop])
}
