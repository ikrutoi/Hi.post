import React from 'react'
import { useAppSelector } from '@app/hooks'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { selectCardtextShowViewMode } from '@cardtext/infrastructure/selectors'
import styles from './CardSectionToolbar.module.scss'

export const CardSectionToolbar: React.FC = () => {
  const { activeSection } = useSectionMenuFacade()
  const cardtextShowViewMode = useAppSelector(selectCardtextShowViewMode)
  const cardtextToolbarSection = cardtextShowViewMode
    ? 'cardtextView'
    : 'cardtext'

  return (
    <div className={styles.cardSectionToolbar}>
      {activeSection === 'cardphoto' && <Toolbar section="cardphoto" />}
      {activeSection === 'cardtext' && (
        <div className={styles.cardSectionToolbarHeader}>
          <Toolbar section="cardtext" />
        </div>
      )}
    </div>
  )
}
