import { CardPanel } from './CardPanel'
import type { SizeCard } from '@layout/domain/types'

type CardPanelWrapperProps = {
  sizeMiniCard: SizeCard | null
}

export const CardPanelWrapper: React.FC<CardPanelWrapperProps> = ({
  sizeMiniCard,
}) => {
  if (!sizeMiniCard) return null

  return <CardPanel sizeMiniCard={sizeMiniCard} />
}
