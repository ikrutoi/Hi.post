import { useRef } from 'react'

import { Cardphoto } from '@cardphoto/presentation/Cardphoto'
import { Cardtext } from '@cardtext/presentation/Cardtext'
import { Envelope } from '@envelope/presentation/Envelope'
import { Aroma } from '@aroma/presentation/Aroma'
import { Date } from '@date/presentation/Date'
import { useLayoutFacade } from '@layout/application/facades'
import type { CardSectionName } from '@shared/types'

import styles from './SectionRenderer.module.scss'

interface SectionRendererProps {
  toolbarColor?: string
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({
  toolbarColor,
}) => {
  const { size, section, meta } = useLayoutFacade()
  const sizeCard = size.sizeCard
  const choiceSection = section.choiceSection
  const choiceClip = meta.choiceClip

  const sectionRef = useRef<HTMLDivElement | null>(null)

  if (!sizeCard?.width || !sizeCard?.height) return null

  const renderSection = (name: CardSectionName | null) => {
    switch (name) {
      case 'cardphoto':
        return (
          <Cardphoto
            sizeCard={sizeCard}
            choiceSection={choiceSection}
            choiceClip={choiceClip}
          />
        )
      case 'cardtext':
        return (
          <Cardtext
            toolbarColor={toolbarColor}
            styleLeftCardPuzzle={
              sectionRef.current?.getBoundingClientRect().left ?? 0
            }
          />
        )
      case 'envelope':
        return <Envelope cardPuzzleRef={sectionRef.current} />
      case 'aroma':
        return <Aroma />
      case 'date':
        return <Date />
      default:
        return null
    }
  }

  return (
    <div
      ref={sectionRef}
      className={styles.sectionRenderer}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      {renderSection(choiceSection.nameSection)}
    </div>
  )
}
