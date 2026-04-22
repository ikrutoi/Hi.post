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
}): boolean {
  const { direction, isSelectedDate, activeSection, dayData, photoPreview } =
    params
  if (direction === 'current') return false
  if (!isSelectedDate) return false
  if (activeSection === 'history') return false
  if (photoPreview?.previewUrl) return false
  if (!dayData) return false

  const { processed, cart, ready, sent, delivered, error } = dayData
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  const workingSlotForSelectedDay =
    activeSection !== 'history' && isSelectedDate && processed
      ? processed
      : null

  const primaryItem =
    workingSlotForSelectedDay ??
    firstPipelineWithPreview ??
    firstPipeline ??
    processed ??
    null

  return !primaryItem
}

/** dayBefore/dayAfter + выбранный день + в сессии выбрана картинка cardphoto — приглушить превью. */
export function shouldAdjacentMonthDimCardphotoPreview(params: {
  direction: MonthDirection
  isSelectedDate: boolean
  activeSection: CardSection | null | undefined
  photoPreview: PhotoPreviewLike
}): boolean {
  const { direction, isSelectedDate, activeSection, photoPreview } = params
  if (direction === 'current') return false
  if (!isSelectedDate) return false
  if (activeSection === 'history') return false
  return Boolean(photoPreview?.previewUrl)
}
