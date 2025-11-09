import { useEffect } from 'react'
import { generateCardphotoPreview } from './generateCardphotoPreview'
import { useLayoutFacade } from '@layout/application/facades'
import type { CartItem } from '@entities/cart/domain/types'
import type { UseCardphotoPreviewOptions } from '../../domain/types'

export const useCardphotoPreview = (options: UseCardphotoPreviewOptions) => {
  const {
    size: { sizeMiniCard },
  } = useLayoutFacade()

  const previewSize = options.size ?? sizeMiniCard
  const sourceItems = options.items

  useEffect(() => {
    sourceItems.forEach(async (item) => {
      const photo = item.card.cardphoto

      if (photo.isComplete && !photo.data.preview) {
        try {
          const preview = await generateCardphotoPreview(
            photo.data.url,
            previewSize
          )

          const updated: CartItem = {
            ...item,
            card: {
              ...item.card,
              cardphoto: {
                ...photo,
                data: {
                  ...photo.data,
                  preview,
                },
              },
            },
          }

          options.onPreviewReady?.(updated)
        } catch {
          // можно логировать ошибку или игнорировать
        }
      }
    })
  }, [sourceItems, previewSize.width, previewSize.height])
}
