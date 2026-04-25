import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { PostcardStatus } from '@entities/postcard'
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
  _status: PostcardStatus | undefined,
  id?: string,
) => {
  const dispatch = useAppDispatch()

  const activeData = useAppSelector(selectActiveCardFullData)
  const editorProgress = useAppSelector(selectPieProgress)
  /** Правая колонка: пирог по открытке из `cart.items` (любой статус кроме processed). */
  const isListArchivePie = !isProcessed && Boolean(id)

  const cartBundle = useAppSelector((state) =>
    isListArchivePie ? selectCartArchiveCardPieBundle(state, id) : null,
  )

  const currentData = isProcessed
    ? activeData
    : isListArchivePie && cartBundle
      ? cartBundle.currentData
      : null

  const sections = isListArchivePie
    ? (cartBundle?.sections ?? EMPTY_CART_PIE_SECTIONS)
    : editorProgress.sections

  const isAllComplete = isListArchivePie
    ? (cartBundle?.isAllComplete ?? false)
    : editorProgress.isAllComplete

  const isRainbowActive = editorProgress.isRainbowActive
  const isRainbowStopping = editorProgress.isRainbowStopping

  return {
    sections,
    data: currentData,
    isRainbowActive,
    isRainbowStopping,
    isReady: isAllComplete,

    onIteration: () => {
      if (isRainbowStopping) {
        dispatch(clearRainbow())
      }
    },
    handleSectorClick: (section: CardSection) => {
      dispatch(setActiveSection(section))
    },
  }
}
