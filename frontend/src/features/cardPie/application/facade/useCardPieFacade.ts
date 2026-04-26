import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import type { PostcardStatus } from '@entities/postcard'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import {
  selectActiveCardFullData,
  selectListArchiveCardPieBundle,
} from '../../infrastructure/selectors'
import type { CardPieRightListSource } from '../../domain/types'
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
  /** `cart` | `history` when the right pie is driven by a list row; ignored for editor pie. */
  listArchiveSource: CardPieRightListSource | null = null,
) => {
  const dispatch = useAppDispatch()

  const activeData = useAppSelector(selectActiveCardFullData)
  const editorProgress = useAppSelector(selectPieProgress)
  /** Правая колонка: пирог по открытке из списка (корзина / история), `id` — `String(localId)`. */
  const isListArchivePie = !isProcessed && Boolean(id)

  const listArchiveBundle = useAppSelector((state) =>
    isListArchivePie
      ? selectListArchiveCardPieBundle(state, id, listArchiveSource)
      : null,
  )

  const currentData = isProcessed
    ? activeData
    : isListArchivePie && listArchiveBundle
      ? listArchiveBundle.currentData
      : null

  const sections = isListArchivePie
    ? (listArchiveBundle?.sections ?? EMPTY_CART_PIE_SECTIONS)
    : editorProgress.sections

  const isAllComplete = isListArchivePie
    ? (listArchiveBundle?.isAllComplete ?? false)
    : editorProgress.isAllComplete

  const isRainbowActive = editorProgress.isRainbowActive
  const isRainbowStopping = editorProgress.isRainbowStopping

  return {
    sections,
    data: currentData,
    isRainbowActive,
    isRainbowStopping,
    isReady: isAllComplete,
    listArchiveSource: isListArchivePie ? listArchiveSource : null,

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
