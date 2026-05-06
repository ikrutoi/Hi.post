import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import {
  selectCardPieCopyStripExpanded,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)

  return (
    <div
      className={clsx(
        styles.cardSectionToolbar,
        cardPieCopyStripExpanded && styles.cardSectionToolbarDisabled,
      )}
    >
      {activeSection === 'cardphoto' && <Toolbar section="cardphoto" />}
      {activeSection === 'date' && !cartListPanelOpen && (
        <Toolbar section="date" />
      )}
      {activeSection === 'cardtext' && (
        <div className={styles.cardSectionToolbarHeader}>
          <Toolbar section="cardtext" />
        </div>
      )}
    </div>
  )
}
