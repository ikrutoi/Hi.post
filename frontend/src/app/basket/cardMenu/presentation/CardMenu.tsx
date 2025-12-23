import React from 'react'
import { CardMenuButton } from './CardMenuButton/CardMenuButton'
import { useLayoutFacade } from '@layout/application/facades'
import { CARD_MENU_SECTIONS } from '@shared/config/constants'
import { useSectionEditorMenuFacade } from '@entities/sectionEditorMenu/application/facades'
// import { useCardMenuFacade } from '../application/facades'
import styles from './CardMenu.module.scss'

export const CardMenu: React.FC = () => {
  const { state: stateSectionEditorMenu, actions: actionsSectionEditorMenu } =
    useSectionEditorMenuFacade()
  const { activeSection } = stateSectionEditorMenu
  const { setActiveSection } = actionsSectionEditorMenu

  const { section } = useLayoutFacade()
  const { choiceSection, selectedSection } = section

  // const activeSection = useMemo(() => {
  //   const { source, section } = choiceSection
  //   if (!source) return null
  //   return ['cart', 'drafts', 'minimize'].includes(source) ? null : section
  // }, [choiceSection])

  return (
    <nav className={styles.cardMenu}>
      {CARD_MENU_SECTIONS.map((section) => {
        const isSelected = activeSection === section.toLowerCase()
        const isHistory = section === 'history'
        const isDisabled = isHistory && !selectedSection

        return (
          <CardMenuButton
            key={section}
            section={section}
            isSelected={isSelected}
            isDisabled={isDisabled}
            // onClick={setActiveSection}
          />
        )
      })}
    </nav>
  )
}
