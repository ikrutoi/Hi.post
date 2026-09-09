import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import {
  selectIsHistoryListPanelOpen,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { useOpenCardphotoFactory } from '@features/cardSectionEditor/application/hooks/useOpenCardphotoFactory'
import type { CardSection } from '@shared/config/constants'
import styles from './FactorySectionsSlotButton.module.scss'

const FACTORY_SECTIONS = new Set<CardSection>([
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
])

type FactorySectionsSlotButtonProps = {
  layout: 'sidebar'
  /** Archive postcard pinned in the right pie — factory slot stays idle. */
  pinned?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const FactorySectionsSlotButton: React.FC<
  FactorySectionsSlotButtonProps
> = ({ layout, pinned = false, onClick }) => {
  const openCardphotoFactory = useOpenCardphotoFactory()
  const activeSection = useAppSelector(selectActiveSection)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)

  const factoryActive = useMemo(() => {
    if (pinned) return false
    if (cartListPanelOpen || historyListPanelOpen) return false
    if (
      isCartOwnedNotebookStrip(notebookStripTab) ||
      notebookStripTab === 'history'
    ) {
      return false
    }
    return activeSection != null && FACTORY_SECTIONS.has(activeSection)
  }, [
    activeSection,
    cartListPanelOpen,
    historyListPanelOpen,
    notebookStripTab,
    pinned,
  ])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(event)
        return
      }
      openCardphotoFactory(event)
    },
    [onClick, openCardphotoFactory],
  )

  return (
    <button
      type="button"
      className={clsx(styles.button, layout === 'sidebar' && styles.sidebar)}
      aria-label="Factory"
      aria-pressed={factoryActive}
      onClick={handleClick}
    />
  )
}
