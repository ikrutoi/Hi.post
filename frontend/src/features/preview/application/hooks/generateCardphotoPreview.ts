import { resizeImage } from '@shared/utils/image/resizeImage'
import type { SizeCard } from '@layout/domain/types'
import type { CardphotoPreview } from '@entities/cardphoto'
import { FormatPreview } from '@entities/preview/domain/types'

export const generateCardphotoPreview = async (
  blob: Blob,
  size: SizeCard,
  format: FormatPreview = 'jpeg'
): Promise<CardphotoPreview> => {
  const resizedBlob = await resizeImage(blob, size.width, size.height)

  return {
    blob: resizedBlob,
    width: size.width,
    height: size.height,
    format,
    // viewportSize: 'md',
  }
}
