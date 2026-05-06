import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCardPieCopyStripExpanded } from '@cart/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { SECTION_EDITOR_MENU_ICON_KEYS } from '@features/toolbar/domain/types/sectionEditorMenu.types'
import { IconLogo, IconLogoFull } from '@shared/ui/icons'
import styles from './SectionEditorSidebar.module.scss'

export const SectionEditorSidebar: React.FC = () => {
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const sectionEditorMenuStateOverride = useMemo(
    () =>
      cardPieCopyStripExpanded
        ? Object.fromEntries(
            SECTION_EDITOR_MENU_ICON_KEYS.map((key) => [key, 'enabled' as const]),
          )
        : undefined,
    [cardPieCopyStripExpanded],
  )

  return (
    <div className={styles.sectionEditorSidebar}>
      <div className={styles.sectionEditorSidebarLogo}>
        <IconLogo aria-hidden />
      </div>
      <Toolbar
        section="sectionEditorMenu"
        stateOverride={sectionEditorMenuStateOverride}
      />
      <div className={styles.sectionEditorSidebarLogoFull}>
        <IconLogoFull aria-hidden />
      </div>
    </div>
  )
}
