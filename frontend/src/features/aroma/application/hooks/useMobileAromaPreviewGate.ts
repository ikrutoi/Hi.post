import { useEffect, useRef, useState } from 'react'

/** Fade out / fade in центрального aroma preview в CardPie. */
export const MOBILE_AROMA_PREVIEW_FADE_MS = 200

export type MobileAromaPreviewTarget = {
  index: number
  src: string
}

export type MobileAromaPreviewPhase = 'hidden' | 'in' | 'out' | 'shown'

export type MobileAromaPreviewGateResult = {
  mounted: MobileAromaPreviewTarget | null
  phase: MobileAromaPreviewPhase
  fadeMs: number
}

function targetKey(target: MobileAromaPreviewTarget | null): string | null {
  if (target == null) return null
  return `${target.index}:${target.src}`
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function preloadDecodedImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    img.onload = finish
    img.onerror = finish
    img.decoding = 'async'
    img.src = url
    if (typeof img.decode === 'function') {
      void img.decode().then(finish).catch(finish)
    }
  })
}

/**
 * Гейт отрисовки центрального aroma preview при выборе слота.
 *
 * Последовательно:
 * 1) fade-out текущего (CSS animation 0.2s)
 * 2) decode следующего
 * 3) swap
 * 4) fade-in (CSS animation 0.2s)
 */
export function useMobileAromaPreviewGate(
  target: MobileAromaPreviewTarget | null,
  options?: { fadeMs?: number },
): MobileAromaPreviewGateResult {
  const fadeMs = options?.fadeMs ?? MOBILE_AROMA_PREVIEW_FADE_MS
  const desiredKey = targetKey(target)

  const [mounted, setMounted] = useState<MobileAromaPreviewTarget | null>(null)
  const [phase, setPhase] = useState<MobileAromaPreviewPhase>('hidden')

  const mountedRef = useRef(mounted)
  mountedRef.current = mounted
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    let cancelled = false
    const desired = desiredKey

    const stillDesired = () =>
      !cancelled && targetKey(targetRef.current) === desired

    const run = async () => {
      const current = mountedRef.current
      const currentKey = targetKey(current)

      if (desired === currentKey) {
        if (desired != null && phaseRef.current !== 'shown') {
          setPhase('in')
          await wait(fadeMs)
          if (!stillDesired()) return
          setPhase('shown')
        }
        return
      }

      // 1) Fade out visible preview.
      if (current != null && phaseRef.current !== 'hidden') {
        setPhase('out')
        await wait(fadeMs)
        if (!stillDesired()) return
        setPhase('hidden')
      }

      if (desired == null) {
        setMounted(null)
        setPhase('hidden')
        return
      }

      const next = targetRef.current
      if (next == null || targetKey(next) !== desired) return

      await preloadDecodedImage(next.src)
      if (!stillDesired()) return

      setMounted(next)
      setPhase('in')
      await wait(fadeMs)
      if (!stillDesired()) return
      setPhase('shown')
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [desiredKey, fadeMs])

  return {
    mounted,
    phase,
    fadeMs,
  }
}
