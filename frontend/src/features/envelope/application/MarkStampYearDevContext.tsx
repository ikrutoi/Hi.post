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
      const base = prev ?? computedRef.current ?? 1
      return Math.min(99, Math.max(1, base + delta))
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
