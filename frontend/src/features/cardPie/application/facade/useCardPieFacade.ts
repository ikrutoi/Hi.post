import { setActiveSection } from '@/entities/sectionEditorMenu/infrastructure/state'
import { openCardphotoFromMiniStripRequested } from '@cardphoto/infrastructure/state'
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
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectAssemblyBranchFreeze } from '@cardPanel/infrastructure/selectors/assemblyBranchFreezeSelectors'

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
  const cardphotoIsComplete = useAppSelector(selectCardphotoIsComplete)
  const assemblyFreeze = useAppSelector(selectAssemblyBranchFreeze)
  const { cardPieEditEngaged } = useRightListArchiveMini()
  /** Правая колонка: пирог по открытке из списка (корзина / история), `id` — `String(localId)`. */
  const isListArchivePie = !isProcessed && Boolean(id)

  const listArchiveBundle = useAppSelector((state) =>
    isListArchivePie
      ? selectListArchiveCardPieBundle(state, id, listArchiveSource)
      : null,
  )

  /**
   * Dual-mode: while archive hydrates shared session (edit or peek), assembly
   * pie keeps the pre-hydrate freeze so left branch does not mix with archive.
   */
  const assemblyUsesFreeze = !isListArchivePie && assemblyFreeze != null

  const currentData = isProcessed
    ? assemblyUsesFreeze
      ? assemblyFreeze.editorData
      : activeData
    : isListArchivePie && listArchiveBundle
      ? listArchiveBundle.currentData
      : null

  const archiveSections =
    listArchiveBundle?.sections ?? EMPTY_CART_PIE_SECTIONS
  /**
   * cardPieEdit: сектор cardphoto на archive CardPie следует session isComplete
   * (apply снят при гидратации), а не appliedData на открытке корзины.
   */
  const sections = isListArchivePie
    ? cardPieEditEngaged
      ? { ...archiveSections, cardphoto: cardphotoIsComplete }
      : archiveSections
    : assemblyUsesFreeze
      ? assemblyFreeze.sections
      : editorProgress.sections

  const isAllComplete = isListArchivePie
    ? cardPieEditEngaged
      ? Boolean(
          sections.cardphoto &&
            sections.cardtext &&
            sections.envelope &&
            sections.aroma &&
            sections.date,
        )
      : (listArchiveBundle?.isAllComplete ?? false)
    : assemblyUsesFreeze
      ? Boolean(
          sections.cardphoto &&
            sections.cardtext &&
            sections.envelope &&
            sections.aroma &&
            sections.date,
        )
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
      if (section === 'cardphoto') {
        dispatch(openCardphotoFromMiniStripRequested())
      }
      dispatch(setActiveSection(section))
    },
  }
}
