// import { useLayoutControllers } from '@layout/application/hooks/useLayoutControllers'
import { useLayoutFacade } from '@layout/application/facades'
import type { CardSectionName } from '@shared/types'

import styles from './SectionNavButton.module.scss'

interface SectionNavButtonProps {
  sectionName: { name: string }
  buttonNav: string | false | null
  setButtonNavRef: (id: string) => (el: HTMLButtonElement | null) => void
  handleMouseEnterBtn: (evt: React.MouseEvent<HTMLButtonElement>) => void
  handleMouseLeaveBtn: (evt: React.MouseEvent<HTMLButtonElement>) => void
}

export const SectionNavButton: React.FC<SectionNavButtonProps> = ({
  sectionName,
  buttonNav,
  setButtonNavRef,
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
}) => {
  const nameNav = sectionName.name.toLowerCase()
  const { meta, actions } = useLayoutFacade()
  const choiceClip = meta.choiceClip

  const handleClick = (clickedSection: CardSectionName) => {
    if (
      clickedSection !== 'envelope' &&
      (choiceClip === 'sender' || choiceClip === 'recipient')
    ) {
      actions.setChoiceClip(null)
      actions.setChoiceSection({
        source: 'buttonNav',
        nameSection: 'envelope',
      })
    }

    if (clickedSection !== 'cardtext' && choiceClip === 'cardtext') {
      actions.setChoiceClip(null)
      actions.setChoiceSection({
        source: 'buttonNav',
        nameSection: 'cardtext',
      })
    }

    if (choiceClip === 'cart' || choiceClip === 'blanks') {
      actions.setChoiceClip(null)
    }

    actions.setChoiceSection({
      source: 'buttonNav',
      nameSection: clickedSection,
    })
    actions.setSelectedSection(clickedSection)
  }

  return (
    <button
      ref={setButtonNavRef(`nav-${nameNav}`)}
      type="button"
      className={`${styles.sectionNavButton} ${styles[`sectionNavButton--${nameNav}`]}`}
      onClick={() => handleClick(nameNav as CardSectionName)}
      onMouseEnter={handleMouseEnterBtn}
      onMouseLeave={handleMouseLeaveBtn}
      style={{
        backgroundColor:
          buttonNav === nameNav ? 'rgb(220, 220, 220)' : 'rgb(240, 240, 240)',
      }}
    >
      {sectionName.name}
    </button>
  )
}
