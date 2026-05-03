import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)

  return (
    <div className={styles.cardSectionToolbar}>
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
