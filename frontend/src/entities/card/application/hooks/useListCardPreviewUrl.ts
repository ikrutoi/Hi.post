import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  clearCalendarPreviewCache,
  requestCalendarPreview,
} from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrlByCardId } from '@entities/card/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { cardImageMetaLookupIdsFromCard } from '@entities/card/domain/helpers'
import {
  cardImageMetaLookupIds,
  isPersistedBlobUrl,
  resolveListPreviewDisplayUrl,
} from '@entities/card/domain/helpers/listPreviewDisplay'

export type ListCardPreviewUrlOptions = {
  /** Как в списках до resilience: processed / current_session — blob: из сессии. */
  previewIsProcessed?: boolean
}

export type ListCardPreviewUrlResult = {
  displayUrl: string | null
  onPreviewImgError: () => void
}

export function useListCardPreviewUrl(
  cardId: string | undefined,
  previewUrl: string | null | undefined,
  options?: ListCardPreviewUrlOptions,
): ListCardPreviewUrlResult {
  const dispatch = useAppDispatch()
  const id = cardId ?? ''
  const cachedUrl = useAppSelector((state) =>
    selectCalendarPreviewDisplayUrlByCardId(state, id),
  )
  const lookupIds = useAppSelector((state) => {
    const postcard = selectCartItems(state).find((p) => p.card.id === id)
    if (postcard) {
      return cardImageMetaLookupIdsFromCard(postcard.card, postcard.postcard)
    }
    return cardImageMetaLookupIds(id, undefined)
  })
  const asset = useAppSelector((state) => {
    const registry = state.assetRegistry.images
    for (const metaId of lookupIds) {
      const hit = registry[metaId]
      if (hit) return hit
    }
    return undefined
  })
  const [retryToken, setRetryToken] = useState(0)

  const requestHydrate = useCallback(() => {
    if (!id) return
    dispatch(
      requestCalendarPreview({
        cardId: id,
        previewUrl: previewUrl?.trim() ? previewUrl : '',
      }),
    )
  }, [dispatch, id, previewUrl])

  useEffect(() => {
    if (!id) return
    if (cachedUrl?.trim()) return
    requestHydrate()
  }, [cachedUrl, id, requestHydrate, retryToken])

  const allowBlobPreview =
    id === 'current_session' || Boolean(options?.previewIsProcessed)

  const displayUrl = resolveListPreviewDisplayUrl({
    cachedUrl,
    previewUrl: previewUrl ?? null,
    registryThumbUrl: asset?.thumbUrl ?? null,
    registryUrl: asset?.url ?? null,
    allowBlobPreview,
  })

  const onPreviewImgError = useCallback(() => {
    if (!id) return
    if (cachedUrl && isPersistedBlobUrl(cachedUrl)) {
      dispatch(clearCalendarPreviewCache(id))
    }
    setRetryToken((t) => t + 1)
    requestHydrate()
  }, [cachedUrl, dispatch, id, requestHydrate])

  return { displayUrl, onPreviewImgError }
}
