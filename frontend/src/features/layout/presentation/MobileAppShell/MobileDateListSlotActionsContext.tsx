import React, { createContext, useContext } from 'react'
import type { CartListPanelItem } from '@cart/presentation/CartListPanel'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'

export type MobileDateListSlotActions = {
  onCartListSelectEntry: (item: CartListPanelItem) => void
  onCartListDateEditEntry: (item: CartListPanelItem) => void
  onHistoryListSelectEntry: (item: HistoryListPanelItem) => void
}

const MobileDateListSlotActionsContext =
  createContext<MobileDateListSlotActions | null>(null)

type MobileDateListSlotActionsProviderProps = MobileDateListSlotActions & {
  children: React.ReactNode
}

export const MobileDateListSlotActionsProvider: React.FC<
  MobileDateListSlotActionsProviderProps
> = ({
  children,
  onCartListSelectEntry,
  onCartListDateEditEntry,
  onHistoryListSelectEntry,
}) => (
  <MobileDateListSlotActionsContext.Provider
    value={{
      onCartListSelectEntry,
      onCartListDateEditEntry,
      onHistoryListSelectEntry,
    }}
  >
    {children}
  </MobileDateListSlotActionsContext.Provider>
)

export const useMobileDateListSlotActions = (): MobileDateListSlotActions => {
  const value = useContext(MobileDateListSlotActionsContext)
  if (value == null) {
    throw new Error(
      'useMobileDateListSlotActions must be used within MobileDateListSlotActionsProvider',
    )
  }
  return value
}
