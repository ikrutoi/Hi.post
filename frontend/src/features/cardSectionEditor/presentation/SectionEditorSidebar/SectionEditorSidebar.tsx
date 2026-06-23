import React, { useMemo } from 'react'
import { IconLogo, IconLogoFull } from '@shared/ui/icons'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { SECTION_EDITOR_MENU_CARD_PIE_TOOLBAR_GROUP } from '@toolbar/domain/types/sectionEditorMenu.types'
import styles from './SectionEditorSidebar.module.scss'

export const SectionEditorSidebar: React.FC = () => {
  const cardPieGroups = useMemo(
    () => [{ ...SECTION_EDITOR_MENU_CARD_PIE_TOOLBAR_GROUP }],
    [],
  )

  return (
    <div className={styles.sectionEditorSidebar}>
      <div className={styles.sectionEditorSidebarLogo}>
        <IconLogo aria-hidden />
      </div>
      <div className={styles.sectionEditorSidebarCardPie}>
        <Toolbar
          section="sectionEditorMenu"
          groupsOverride={cardPieGroups}
          layout="sidebarChrome"
        />
      </div>
      <div className={styles.sectionEditorSidebarLogoFull}>
        <IconLogoFull aria-hidden />
      </div>
    </div>
  )
}
