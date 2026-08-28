import { useCallback, useEffect, useRef, useState, type AnimationEvent } from 'react'

const HINT_DELAY_MS = 1800

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * After cart/history turns on (circle icon appears), wait 1.8s then pulse the
 * circle twice — a hint that another click on the same slot switches mode.
 * Cancels if the user clicks while already on, and does not hint again
 * this session once that second click happened.
 */
export function useMobileArchiveSlotSecondClickHint(slotActive: boolean) {
  const [pulsing, setPulsing] = useState(false)
  const discoveredRef = useRef(false)
  const delayRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const slotActiveRef = useRef(slotActive)
  slotActiveRef.current = slotActive

  const clearDelay = useCallback(() => {
    if (delayRef.current == null) return
    window.clearTimeout(delayRef.current)
    delayRef.current = null
  }, [])

  useEffect(() => {
    if (!slotActive || discoveredRef.current || prefersReducedMotion()) {
      clearDelay()
      setPulsing(false)
      return
    }

    delayRef.current = window.setTimeout(() => {
      delayRef.current = null
      if (!discoveredRef.current) setPulsing(true)
    }, HINT_DELAY_MS)

    return () => {
      clearDelay()
    }
  }, [slotActive, clearDelay])

  const onUserClick = useCallback(() => {
    if (!slotActiveRef.current) return
    discoveredRef.current = true
    clearDelay()
    setPulsing(false)
  }, [clearDelay])

  const onPulseEnd = useCallback((event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    setPulsing(false)
  }, [])

  return { pulsing, onUserClick, onPulseEnd }
}
