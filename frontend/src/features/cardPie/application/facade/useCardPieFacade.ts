import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { CardStatus } from '@entities/postcard'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import {
  selectActiveCardFullData,
  selectCartArchiveCardPieBundle,
} from '../../infrastructure/selectors'
import { CardSection } from '@/shared/config/constants'
import { clearRainbow } from '@/entities/cardEditor/infrastructure/state'

const EMPTY_CART_PIE_SECTIONS = {
  cardphoto: false,
  cardtext: false,
  envelope: false,
  aroma: false,
  date: false,
} as const

export const useCardPieFacade = (
  isProcessed: boolean,
  status: CardStatus | undefined,
  id?: string,
) => {
  const dispatch = useAppDispatch()

  const activeData = useAppSelector(selectActiveCardFullData)
  const editorProgress = useAppSelector(selectPieProgress)
  const isCartArchive = !isProcessed && status === 'cart'

  const cartBundle = useAppSelector((state) =>
    isCartArchive ? selectCartArchiveCardPieBundle(state, id) : null,
  )

  const currentData = isProcessed
    ? activeData
    : isCartArchive && cartBundle
      ? cartBundle.currentData
      : null

  const sections = isCartArchive
    ? (cartBundle?.sections ?? EMPTY_CART_PIE_SECTIONS)
    : editorProgress.sections

  const isAllComplete = isCartArchive
    ? (cartBundle?.isAllComplete ?? false)
    : editorProgress.isAllComplete

  const isRainbowActive = editorProgress.isRainbowActive
  const isRainbowStopping = editorProgress.isRainbowStopping

  const isEditable =
    isProcessed || status === 'favorite' || status === 'error'

  return {
    sections,
    data: currentData,
    isRainbowActive,
    isRainbowStopping,
    isReady: isAllComplete,
    isEditable,

    onIteration: () => {
      if (isRainbowStopping) {
        dispatch(clearRainbow())
      }
    },
    handleSectorClick: (section: CardSection) => {
      if (isEditable) dispatch(setActiveSection(section))
    },
  }
}
