import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import type { DateStripSection } from './dateStripSection.types'

/**
 * Режим закладок Date / Cart / History в центральной полосе, когда активна не только секция «Дата»
 * (упрощённый peek по правому пирогу): подсветка совпадает с `activeSection` и корзиной.
 */
export function useDateStripSectionForNotebookTabs(): DateStripSection {
  const activeSection = useAppSelector(selectActiveSection)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)

  return useMemo(() => {
    if (activeSection === 'history') return 'history'
    if (cartListPanelOpen) return 'cart'
    return 'date'
  }, [activeSection, cartListPanelOpen])
}
