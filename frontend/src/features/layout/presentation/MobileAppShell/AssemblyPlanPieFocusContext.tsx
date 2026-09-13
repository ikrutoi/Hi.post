import React, { createContext, useContext } from 'react'

type AssemblyPlanPieFocusValue = {
  cycleFocusedRecipient: () => void
}

const AssemblyPlanPieFocusContext =
  createContext<AssemblyPlanPieFocusValue | null>(null)

export const AssemblyPlanPieFocusProvider = AssemblyPlanPieFocusContext.Provider

/** Factory addressNext: recipient group → next group → overview (count). */
export function useAssemblyPlanPieFocusCycle(): () => void {
  const ctx = useContext(AssemblyPlanPieFocusContext)
  return ctx?.cycleFocusedRecipient ?? noopCycle
}

function noopCycle(): void {}
