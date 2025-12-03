import {
  MiniCardphoto,
  MiniCardtext,
  MiniEnvelope,
  MiniAroma,
  MiniDate,
} from '../../presentation/miniSections/presentation'
import type { CardSection } from '@entities/card/domain/types'

// import { MiniCardRenderProps } from '../../domain/types'

interface MiniCardRenderProps {
  section: CardSection
  sizeMiniCard: { width: number; height: number }
  cardMiniSectionRef: HTMLDivElement | null
}

export const useMiniCardRender = () => {
  const render = ({
    section,
    sizeMiniCard,
    cardMiniSectionRef,
  }: MiniCardRenderProps) => {
    const commonProps = { heightMinicard: sizeMiniCard.height }

    switch (section) {
      case 'cardphoto':
        return <MiniCardphoto sizeMiniCard={sizeMiniCard} />
      case 'cardtext':
        return (
          <MiniCardtext
            {...commonProps}
            cardMiniSectionRef={cardMiniSectionRef}
          />
        )
      case 'envelope':
        return <MiniEnvelope />
      case 'aroma':
        return <MiniAroma {...commonProps} />
      case 'date':
        return <MiniDate {...commonProps} />
      default:
        return null
    }
  }

  return { render }
}
