import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

type MarkStampYearDevContextValue = {
  override: number | null
  setOverride: (value: number | null) => void
  /** Последнее значение по дате (обновляет Mark); для +/- когда override ещё null. */
  syncComputedFromDispatch: (value: number | null) => void
  bump: (delta: number) => void
}

const MarkStampYearDevContext =
  createContext<MarkStampYearDevContextValue | null>(null)

/** Кольцо для dev-кнопок ±: 1 … 100, дальше снова 1 (с 1 вниз → 100). */
const STAMP_DEV_RING_MAX = 100

function wrapStampDevRing(value: number, delta: number): number {
  const n = STAMP_DEV_RING_MAX
  const v = Math.min(n, Math.max(1, Math.round(value)))
  let idx = (v - 1 + delta) % n
  if (idx < 0) idx += n
  return idx + 1
}

export function MarkStampYearDevProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [override, setOverride] = useState<number | null>(null)
  const computedRef = useRef<number | null>(null)

  const syncComputedFromDispatch = useCallback((value: number | null) => {
    computedRef.current = value
  }, [])

  const bump = useCallback((delta: number) => {
    setOverride((prev) => {
      const raw = prev ?? computedRef.current ?? 1
      const base =
        typeof raw === 'number' && Number.isFinite(raw)
          ? Math.round(raw)
          : 1
      return wrapStampDevRing(base, delta)
    })
  }, [])

  const value = useMemo(
    () => ({
      override,
      setOverride,
      syncComputedFromDispatch,
      bump,
    }),
    [override, syncComputedFromDispatch, bump],
  )

  return (
    <MarkStampYearDevContext.Provider value={value}>
      {children}
    </MarkStampYearDevContext.Provider>
  )
}

export function useMarkStampYearDev(): MarkStampYearDevContextValue {
  const ctx = useContext(MarkStampYearDevContext)
  if (ctx == null) {
    throw new Error(
      'useMarkStampYearDev must be used within MarkStampYearDevProvider',
    )
  }
  return ctx
}

export function useMarkStampYearDevOptional(): MarkStampYearDevContextValue | null {
  return useContext(MarkStampYearDevContext)
}
