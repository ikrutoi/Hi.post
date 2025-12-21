import React from 'react'
import { useEffect, useMemo } from 'react'
import clsx from 'clsx'
// import { CardMenuButton } from './CardMenuButton/CardMenuButton'
import { useLayoutFacade } from '@layout/application/facades'
import { CARD_SECTIONS } from '@shared/config/constants'
import { useCardMenuFacade } from '@cardMenu/application/facades'
import styles from './SectionEditorMenu.module.scss'

export const SectionEditorMenu: React.FC = () => {
  const { state: stateCardMenu, actions: actionsCardMenu } = useCardMenuFacade()
  const { activeSection } = stateCardMenu
  const { setActiveSection } = actionsCardMenu

  const { section, size } = useLayoutFacade()
  const { choiceSection, selectedSection } = section

  // const activeSection = useMemo(() => {
  //   const { source, section } = choiceSection
  //   if (!source) return null
  //   return ['cart', 'drafts', 'minimize'].includes(source) ? null : section
  // }, [choiceSection])

  return (
    <nav className={styles.sectionEditorMenu}>
      {CARD_SECTIONS.map((section) => {
        const isSelected = activeSection === section.toLowerCase()

        return (
          <div
            key={section}
            className={clsx(styles.sectionEditorMenuButton)}
            // section={section}
            // isSelected={isSelected}
            // onClick={setActiveSection}
          />
        )
      })}
    </nav>
  )
}
