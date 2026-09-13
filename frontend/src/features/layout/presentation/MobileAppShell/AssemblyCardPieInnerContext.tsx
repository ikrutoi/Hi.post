import React, { createContext, useContext } from 'react'
import type { CardPieInnerData } from '@features/cardPie/infrastructure/postcardCardPieViewModel'

/**
 * Inner data of the central assembly CardPie (`selectedPlanPie ?? overview`).
 * Factory Recipients/Date peeks should follow this, not the full session lists.
 */
const AssemblyCardPieInnerContext = createContext<CardPieInnerData | null>(null)

export const AssemblyCardPieInnerProvider = AssemblyCardPieInnerContext.Provider

export function useAssemblyCardPieInner(): CardPieInnerData | null {
  return useContext(AssemblyCardPieInnerContext)
}
