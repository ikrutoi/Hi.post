import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { useSizeFacade } from '@layout/application/facades'

type MobileScenarioToolbarContextValue = {
  scenarioToolbar: React.ReactNode
  setScenarioToolbar: (node: React.ReactNode) => void
}

const MobileScenarioToolbarContext =
  createContext<MobileScenarioToolbarContextValue | null>(null)

export const MobileScenarioToolbarProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [scenarioToolbar, setScenarioToolbarState] =
    useState<React.ReactNode>(null)

  const setScenarioToolbar = useCallback((node: React.ReactNode) => {
    setScenarioToolbarState(node)
  }, [])

  const value = useMemo(
    () => ({ scenarioToolbar, setScenarioToolbar }),
    [scenarioToolbar, setScenarioToolbar],
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

/** Mobile: сценарный тулбар (row 2) рендерится в общем shell, не внутри секции. */
export function useMobileScenarioToolbar(content: React.ReactNode) {
  const { isMobileLayout } = useSizeFacade()
  const ctx = useMobileScenarioToolbarContext()

  useLayoutEffect(() => {
    if (!isMobileLayout || ctx == null) return
    ctx.setScenarioToolbar(content)
    return () => ctx.setScenarioToolbar(null)
  }, [isMobileLayout, ctx, content])
}
