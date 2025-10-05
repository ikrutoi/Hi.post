import {
  MiniCardphoto,
  MiniCardtext,
  MiniEnvelope,
  MiniAroma,
  MiniDate,
} from '../../presentation/miniSections/presentation'

import { MiniCardRenderProps } from '../../domain/types'

export const useMiniCardRender = () => {
  const render = ({
    section,
    valueSection,
    sizeMiniCard,
    ref,
  }: MiniCardRenderProps) => {
    const commonProps = { valueSection, heightMinicard: sizeMiniCard.height }

    switch (section) {
      case 'cardphoto':
        return <MiniCardphoto sizeMiniCard={sizeMiniCard} />
      case 'cardtext':
        return <MiniCardtext {...commonProps} cardMiniSectionRef={ref} />
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
