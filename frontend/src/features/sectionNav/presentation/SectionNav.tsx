import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { SectionNavButton } from '../sectionNavButton/presentation/SectionNavButton'
import { stateColors } from '@shared/config/theme'
import { colorSchemeNav } from '@data/nav/colorSchemeNav'
import { CARD_SECTIONS } from '@shared/types'
import type { RootState } from '@app/state'

import styles from './SectionNav.module.scss'

type BtnNavRefs = Record<string, HTMLButtonElement | null>

export const SectionNav: React.FC = () => {
  const infoChoiceSection = useSelector(
    (state: RootState) => state.layout.choiceSection
  )
  const infoNavHistory = useSelector(
    (state: RootState) => state.infoButtons.navHistory
  )

  const buttonNavRefs = useRef<BtnNavRefs>({})
  const [buttonNav, setButtonNav] = useState<string | false | null>(null)

  useEffect(() => {
    const { source, nameSection } = infoChoiceSection
    if (!['cart', 'blanks', 'minimize'].includes(source)) {
      setButtonNav(nameSection)
    } else {
      setButtonNav(false)
    }
  }, [infoChoiceSection])

  const setButtonNavRef =
    (id: string) => (element: HTMLButtonElement | null) => {
      buttonNavRefs.current[id] = element
    }

  const handleMouseEnterBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const section = evt.currentTarget.dataset.section
    if ((section !== 'history' && !infoNavHistory) || section === buttonNav) {
      evt.currentTarget.style.backgroundColor = 'rgb(220, 220, 220)'
    }
  }

  const handleMouseLeaveBtn = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const section = evt.currentTarget.dataset.section
    if (section !== buttonNav) {
      evt.currentTarget.style.backgroundColor = 'rgb(240, 240, 240)'
    }
  }

  useEffect(() => {
    const historyBtn = buttonNavRefs.current['nav-history']
    if (historyBtn) {
      historyBtn.style.color = colorSchemeNav[infoNavHistory]
      historyBtn.style.cursor = infoNavHistory ? 'pointer' : 'default'
    }
  }, [infoNavHistory])

  return (
    <div className={styles.sectionNav}>
      {CARD_SECTIONS.map((section, i) => (
        <SectionNavButton
          key={`${section}-${i}`}
          buttonNavRefs={buttonNavRefs}
          setButtonNavRef={setButtonNavRef}
          sectionName={section}
          handleMouseEnterBtn={handleMouseEnterBtn}
          handleMouseLeaveBtn={handleMouseLeaveBtn}
          buttonNav={buttonNav}
        />
      ))}
    </div>
  )
}

// export default SectionNav
