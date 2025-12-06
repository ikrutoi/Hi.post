import {
  MiniCardphoto,
  MiniCardtext,
  MiniEnvelope,
  MiniAroma,
  MiniDate,
} from '../../presentation/miniSections/presentation'
import type { CardSection } from '@shared/config/constants'

interface MiniCardRenderProps {
  section: CardSection
  cardMiniSectionRef: HTMLDivElement | null
}

export const useMiniCardRender = () => {
  const render = ({ section, cardMiniSectionRef }: MiniCardRenderProps) => {
    switch (section) {
      case 'cardphoto':
        return <MiniCardphoto />
      case 'cardtext':
        return <MiniCardtext cardMiniSectionRef={cardMiniSectionRef} />
      case 'envelope':
        return <MiniEnvelope />
      case 'aroma':
        return <MiniAroma />
      case 'date':
        return <MiniDate />
      default:
        return null
    }
  }

  return { render }
}
