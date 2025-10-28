import type { RefObject } from 'react'
import { Cardphoto } from '@cardphoto/presentation/Cardphoto'
import { Cardtext } from '@cardtext/presentation/Cardtext'
import { Envelope } from '@envelope/presentation/Envelope'
import { Aroma } from '@aroma/presentation/Aroma'
import { Date } from '@date/presentation/Date'
import type { CardMenuSection } from '@shared/config/constants'

export const renderCardSection = (
  section: CardMenuSection | null,
  options: {
    // sizeCard: { width: number; height: number }
    // choiceSection: any
    // choiceClip: any
    // toolbarColor?: string
    sectionLeft: number
    sectionRef: RefObject<HTMLDivElement | null>
  }
) => {
  const {
    // sizeCard,
    // choiceSection,
    // choiceClip,
    // toolbarColor,
    sectionLeft,
    sectionRef,
  } = options

  switch (section) {
    case 'cardphoto':
      return (
        <Cardphoto
        // sizeCard={sizeCard}
        // choiceSection={choiceSection}
        // choiceClip={choiceClip}
        />
      )
    case 'cardtext':
      return (
        <Cardtext
          // toolbarColor={toolbarColor}
          styleLeft={sectionLeft ?? 0}
        />
      )
    case 'envelope':
      return <Envelope cardPuzzleRef={sectionRef} />
    case 'aroma':
      return <Aroma />
    case 'date':
      return <Date />
    default:
      return null
  }
}
