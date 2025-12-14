import {
  MiniCardphoto,
  MiniCardtext,
  MiniEnvelope,
  MiniAroma,
  MiniDate,
  MiniCardtextScale,
} from '../../presentation/miniSections/presentation'
import type { CardSection } from '@shared/config/constants'

interface MiniCardRenderProps {
  section: CardSection
}

export const useMiniCardRender = () => {
  const render = ({ section }: MiniCardRenderProps) => {
    switch (section) {
      case 'cardphoto':
        return <MiniCardphoto />
      case 'cardtext':
        return <MiniCardtext />
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
