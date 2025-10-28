import clsx from 'clsx'
import { useLayoutFacade } from '@layout/application/facades'
import { useLayoutNavFacade } from '@layoutNav/application/facades'
import styles from './CardMenuButton.module.scss'
import type { CardMenuSection } from '@shared/config/constants'
import { useEffect } from 'react'

interface CardMenuButtonProps {
  section: CardMenuSection
  isSelected: boolean
  isDisabled?: boolean
}

export const CardMenuButton: React.FC<CardMenuButtonProps> = ({
  section,
  isSelected,
  isDisabled = false,
}) => {
  const { state: stateLayoutNav, actions: actionsLayoutNav } =
    useLayoutNavFacade()
  const { selectedCardMenuSection } = stateLayoutNav
  const { ui: uiLayout, actions: actionsLayout } = useLayoutFacade()
  const selectedTemplate = uiLayout.selectedTemplate

  const handleClick = (section: CardMenuSection) => {
    const clickedSection = section.toLowerCase() as CardMenuSection

    if (
      clickedSection !== 'envelope' &&
      ['sender', 'recipient'].includes(selectedTemplate ?? '')
    ) {
      actionsLayout.selectTemplate(null)
      actionsLayout.setChoiceSection({
        source: 'buttonNav',
        section: 'envelope',
      })
    }

    if (clickedSection !== 'cardtext' && selectedTemplate === 'cardtext') {
      actionsLayout.selectTemplate(null)
      actionsLayout.setChoiceSection({
        source: 'buttonNav',
        section: 'cardtext',
      })
    }

    if (['cart', 'drafts'].includes(selectedTemplate ?? '')) {
      actionsLayout.selectTemplate(null)
    }

    actionsLayout.setChoiceSection({
      source: 'buttonNav',
      section: clickedSection,
    })
    actionsLayout.setSelectedSection(clickedSection)

    actionsLayoutNav.selectCardMenuSection(section)
  }

  return (
    <button
      type="button"
      className={clsx(
        styles.cardMenuButton,
        styles[`cardMenuButton--${section.toLowerCase()}`],
        {
          [styles.active]: isSelected,
          [styles.disabled]: isDisabled,
        }
      )}
      onClick={() => handleClick(section)}
      disabled={isDisabled}
    >
      {section}
    </button>
  )
}
