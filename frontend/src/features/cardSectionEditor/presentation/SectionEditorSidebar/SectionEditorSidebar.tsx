import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCardPieCopyStripExpanded } from '@cart/infrastructure/selectors'
import { Toolbar } from '@features/toolbar/presentation/Toolbar'
import { SECTION_EDITOR_MENU_ICON_KEYS } from '@features/toolbar/domain/types/sectionEditorMenu.types'
import { IconLogo, IconLogoFull } from '@shared/ui/icons'
import styles from './SectionEditorSidebar.module.scss'

type SectionEditorSidebarProps = {
  variant?: 'sidebar' | 'footer'
  /** Перед стандартным toolbar/action: pin правого CardPie, выход из copy и т.п. */
  onSectionEditorMenuAction?: () => void
  /**
   * Упрощённый peek (cardPieCopy / правый CardPie без cardPieEdit): не подсвечивать пункты меню
   * при `setActiveSection` из секторов пирога или мини-полосы.
   */
  suppressSectionMenuActiveHighlight?: boolean
}

export const SectionEditorSidebar: React.FC<SectionEditorSidebarProps> = ({
  variant = 'sidebar',
  onSectionEditorMenuAction,
  suppressSectionMenuActiveHighlight = false,
}) => {
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const sectionEditorMenuStateOverride = useMemo(() => {
    const suppress =
      cardPieCopyStripExpanded || suppressSectionMenuActiveHighlight
    if (!suppress) return undefined
    return Object.fromEntries(
      SECTION_EDITOR_MENU_ICON_KEYS.map((key) => [key, 'enabled' as const]),
    )
  }, [cardPieCopyStripExpanded, suppressSectionMenuActiveHighlight])

  const toolbar = (
    <Toolbar
      section="sectionEditorMenu"
      layout={variant === 'footer' ? 'bottomBar' : undefined}
      stateOverride={sectionEditorMenuStateOverride}
      onActionClick={() => {
        onSectionEditorMenuAction?.()
      }}
    />
  )

  if (variant === 'footer') {
    return (
      <nav
        className={styles.sectionEditorFooter}
        aria-label="Section editor menu"
      >
        {toolbar}
      </nav>
    )
  }

  return (
    <div className={styles.sectionEditorSidebar}>
      <div className={styles.sectionEditorSidebarLogo}>
        <IconLogo aria-hidden />
      </div>
      {toolbar}
      <div className={styles.sectionEditorSidebarLogoFull}>
        <IconLogoFull aria-hidden />
      </div>
    </div>
  )
}
