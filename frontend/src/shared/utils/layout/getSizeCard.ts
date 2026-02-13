import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'

export const getSizeCard = (
  sizeForm: { width: number; height: number },
  remSize: number,
) => {
  console.log('getSizeCard sizeForm', sizeForm)
  const rawHeight = sizeForm.height - 9 * remSize
  const rawWidth = rawHeight * CARD_SCALE_CONFIG.aspectRatio
  console.log(
    'getSizeCard size',
    roundTo.nearest(rawWidth),
    roundTo.nearest(rawHeight),
  )

  return {
    width: roundTo.nearest(rawWidth),
    height: roundTo.nearest(rawHeight),
  }
}
