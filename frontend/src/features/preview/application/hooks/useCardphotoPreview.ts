import { useEffect } from 'react'
import { generateCardphotoPreview } from './generateCardphotoPreview'
import { useLayoutFacade } from '@layout/application/facades'
import { postcardRefsFromCard, type PostcardHydrated } from '@entities/postcard'
import type { UseCardphotoPreviewOptions } from '../../domain/types'

export const useCardphotoPreview = (options: UseCardphotoPreviewOptions) => {
  const {
    size: { sizeMiniCard },
  } = useLayoutFacade()

  const previewSize = options.size ?? sizeMiniCard
  const sourceItems = options.items

  useEffect(() => {
    sourceItems.forEach(async (item) => {
      /** Legacy preset shape used `isComplete` + `data`; `CardphotoState` uses `appliedData`. */
      const photo = item.card.cardphoto as unknown as {
        isComplete?: boolean
        data?: { preview?: unknown; url?: Blob }
      }

      if (photo.isComplete && !photo.data?.preview && photo.data?.url) {
        try {
          const preview = await generateCardphotoPreview(
            photo.data.url,
            previewSize,
          )

          const nextCard = {
            ...item.card,
            cardphoto: {
              ...(item.card.cardphoto as object),
              ...photo,
              data: {
                ...photo.data,
                preview,
              },
            } as unknown as typeof item.card.cardphoto,
          }
          const updated: PostcardHydrated = {
            ...item,
            postcard: postcardRefsFromCard(nextCard),
            card: nextCard,
          }

          options.onPreviewReady?.(updated)
        } catch {
          // можно логировать ошибку или игнорировать
        }
      }
    })
  }, [sourceItems, previewSize.width, previewSize.height])
}
