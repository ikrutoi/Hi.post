import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
import { useSizeFacade } from '@layout/application/facades'

type ScenarioToolbarSlot = {
  render: () => React.ReactNode
}

type MobileScenarioToolbarContextValue = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
  getScenarioToolbar: () => React.ReactNode
  registerScenarioToolbar: (id: string, render: () => React.ReactNode) => void
  bumpScenarioToolbar: () => void
  unregisterScenarioToolbar: (id: string) => void
}

const MobileScenarioToolbarContext =
  createContext<MobileScenarioToolbarContextValue | null>(null)

export const MobileScenarioToolbarProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const slotsRef = useRef<Map<string, ScenarioToolbarSlot>>(new Map())
  const versionRef = useRef(0)
  const listenersRef = useRef(new Set<() => void>())

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener)
    return () => {
      listenersRef.current.delete(listener)
    }
  }, [])

  const notify = useCallback(() => {
    listenersRef.current.forEach((listener) => listener())
  }, [])

  const getSnapshot = useCallback(() => versionRef.current, [])

  const getScenarioToolbar = useCallback(() => {
    const slots = slotsRef.current
    if (slots.size === 0) return null

    const lastSlot = Array.from(slots.values()).at(-1)
    return lastSlot?.render() ?? null
  }, [])

  const registerScenarioToolbar = useCallback(
    (id: string, render: () => React.ReactNode) => {
      slotsRef.current.set(id, { render })
    },
    [],
  )

  const bumpScenarioToolbar = useCallback(() => {
    versionRef.current += 1
    notify()
  }, [notify])

  const unregisterScenarioToolbar = useCallback(
    (id: string) => {
      if (!slotsRef.current.delete(id)) return
      versionRef.current += 1
      notify()
    },
    [notify],
  )

  const value = useMemo(
    () => ({
      subscribe,
      getSnapshot,
      getScenarioToolbar,
      registerScenarioToolbar,
      bumpScenarioToolbar,
      unregisterScenarioToolbar,
    }),
    [
      subscribe,
      getSnapshot,
      getScenarioToolbar,
      registerScenarioToolbar,
      bumpScenarioToolbar,
      unregisterScenarioToolbar,
    ],
  )

  return (
    <MobileScenarioToolbarContext.Provider value={value}>
      {children}
    </MobileScenarioToolbarContext.Provider>
  )
}

export function useMobileScenarioToolbarContext() {
  return useContext(MobileScenarioToolbarContext)
}

export function useMobileScenarioToolbarSnapshot() {
  const ctx = useMobileScenarioToolbarContext()
  const noopSubscribe = useCallback((_listener: () => void) => () => {}, [])

  useSyncExternalStore(
    ctx?.subscribe ?? noopSubscribe,
    ctx?.getSnapshot ?? (() => 0),
    ctx?.getSnapshot ?? (() => 0),
  )

  return ctx?.getScenarioToolbar() ?? null
}

/** Mobile: сценарный тулбар (row 2) рендерится в общем shell, не внутри секции. */
export function useMobileScenarioToolbar(content: React.ReactNode) {
  const { isMobileLayout } = useSizeFacade()
  const ctx = useMobileScenarioToolbarContext()
  const slotId = useId()

  useLayoutEffect(() => {
    if (!isMobileLayout || ctx == null) return

    ctx.registerScenarioToolbar(slotId, () => content)
    ctx.bumpScenarioToolbar()

    return () => {
      ctx.unregisterScenarioToolbar(slotId)
    }
  }, [isMobileLayout, ctx, slotId, content])
}
