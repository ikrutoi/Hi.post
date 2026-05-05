import React, { createContext, useContext } from 'react'

/** Сторона квадратной ячейки мини-секции в полосе (px), для масштаба текста зеркала. */
const MiniStripCellSideContext = createContext<number | null>(null)

export const MiniStripCellSideProvider = MiniStripCellSideContext.Provider

export function useMiniStripCellSidePx(): number | null {
  return useContext(MiniStripCellSideContext)
}
