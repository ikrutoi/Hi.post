import { useCallback, useEffect, useRef, useState, type AnimationEvent } from 'react'

const HINT_DELAY_MS = 1600

type ArchiveHintSession = {
  firstPostcardId: number | null
  discovered: boolean
}

/** Persist across archive CardPie remounts (mobile fade gate). */
const archiveCenterHintSessions = new Map<string, ArchiveHintSession>()

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isArchiveCenterCycleHintEligible(input: {
  cycleForward: boolean
  source: 'cart' | 'history' | null
  cartPostcardCount: number
  historyPostcardCount: number
}): boolean {
  if (!input.cycleForward || input.source == null) return false
  if (input.source === 'cart') return input.cartPostcardCount > 1
  return input.historyPostcardCount > 1
}

function archiveCenterHintSessionKey(
  source: 'cart' | 'history',
  viewMode: 'list' | 'calendar',
): string {
  return `${source}-${viewMode}`
}

function getArchiveHintSession(key: string): ArchiveHintSession {
  let session = archiveCenterHintSessions.get(key)
  if (session == null) {
    session = { firstPostcardId: null, discovered: false }
    archiveCenterHintSessions.set(key, session)
  }
  return session
}

/**
 * Cart/history center cycle hint: pulse once per (source + list/calendar) visit
 * and only for the first postcard shown. Switching rows/days in the same view
 * must not re-trigger the hint (survives mobile CardPie remount).
 */
export function useArchiveCenterCycleClickHint(input: {
  enabled: boolean
  source: 'cart' | 'history' | null
  viewMode: 'list' | 'calendar' | null
  postcardLocalId: number | null
}) {
  const { enabled, source, viewMode, postcardLocalId } = input
  const contextKey =
    source != null && viewMode != null
      ? archiveCenterHintSessionKey(source, viewMode)
      : null

  useEffect(() => {
    if (source != null) return
    archiveCenterHintSessions.clear()
  }, [source])

  useEffect(() => {
    if (contextKey == null || postcardLocalId == null) return
    const session = getArchiveHintSession(contextKey)
    if (session.firstPostcardId == null) {
      session.firstPostcardId = postcardLocalId
    }
  }, [contextKey, postcardLocalId])

  const hintSuppressed = Boolean(
    contextKey != null &&
      (() => {
        const session = getArchiveHintSession(contextKey)
        if (session.discovered) return true
        return (
          session.firstPostcardId != null &&
          postcardLocalId != null &&
          session.firstPostcardId !== postcardLocalId
        )
      })(),
  )

  const slotActive = Boolean(
    enabled &&
      contextKey != null &&
      postcardLocalId != null &&
      !hintSuppressed,
  )

  const hint = useMobileArchiveSlotSecondClickHint(slotActive)

  const onUserClick = useCallback(() => {
    if (contextKey != null) {
      getArchiveHintSession(contextKey).discovered = true
    }
    hint.onUserClick()
  }, [contextKey, hint.onUserClick])

  return {
    pulsing: hint.pulsing,
    onUserClick,
    onPulseEnd: hint.onPulseEnd,
  }
}

/**
 * After cart/history turns on (circle icon appears), wait 1.6s then pulse the
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
