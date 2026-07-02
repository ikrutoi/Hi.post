import type { MonthDirection } from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { CardSection } from '@shared/config/constants'

type PhotoPreviewLike = { previewUrl?: string | null } | null | undefined

/**
 * Совпадение «стрелка соседнего месяца + плейсхолдер cardphoto без картинки» —
 * как в CardPreview: showEmptySessionPlaceholder.
 */
export function shouldAdjacentSessionPlaceholderNavSwap(params: {
  direction: MonthDirection
  isSelectedDate: boolean
  activeSection: CardSection | null | undefined
  dayData: CardCalendarIndex | null | undefined
  photoPreview: PhotoPreviewLike
  /** Cart list open on Date strip: calendar shows cart pipeline — like history for placeholder swap. */
  cartListPanelOpen?: boolean
  /** Mobile header History tab keeps activeSection on date. */
  historyCalendarStrip?: boolean
}): boolean {
  const {
    direction,
    isSelectedDate,
    activeSection,
    dayData,
    photoPreview,
    cartListPanelOpen = false,
    historyCalendarStrip = false,
  } = params
  const isHistory = activeSection === 'history' || historyCalendarStrip
  if (direction === 'current') return false
  if (!isSelectedDate) return false
  if (isHistory) return false
  if (activeSection === 'date' && cartListPanelOpen) return false
  if (photoPreview?.previewUrl) return false
  if (!dayData) return false

  const { processed, cart, ready, sent, delivered, error } = dayData
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  const workingSlotForSelectedDay =
    !isHistory && isSelectedDate && processed
      ? processed
      : null

  const noSessionCardphotoImage = !photoPreview?.previewUrl

  const primaryItem =
    !isHistory &&
    isSelectedDate &&
    noSessionCardphotoImage
      ? workingSlotForSelectedDay ?? null
      : workingSlotForSelectedDay ??
        firstPipelineWithPreview ??
        firstPipeline ??
        processed ??
        null

  return !primaryItem
}
