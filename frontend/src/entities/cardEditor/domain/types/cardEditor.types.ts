import { CardSection } from '@shared/config/constants'

export type CardEditorState = {
  id: string
  cardphoto: { isComplete: boolean }
  cardtext: { isComplete: boolean }
  envelope: { isComplete: boolean }
  aroma: { isComplete: boolean }
  date: { isComplete: boolean }
  isCompleted: boolean
  /** CardPie: пользователь отметил текущую открытку в избранном (переключатель). */
  pieFavorite: boolean
  isRainbowActive: boolean
  isRainbowStopping: boolean
  hoveredSection: CardSection | null
}
