import type { SagaIterator } from 'redux-saga'
import { call, select } from 'redux-saga/effects'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'
import type { ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import {
  hydrateMeta,
  hydrateSessionImageMeta,
} from '@app/middleware/cardphotoHelpers'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'

function withBlob(meta: ImageMeta, blob: Blob): ImageMeta {
  const objectUrl = URL.createObjectURL(blob)
  return {
    ...meta,
    source: 'original',
    url: objectUrl,
    full: {
      ...meta.full,
      blob,
      url: objectUrl,
    },
  }
}

function* fetchBlobFromUrl(url: string): SagaIterator<Blob | null> {
  try {
    const blob: Blob = yield call(async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`blob fetch ${res.status}`)
      return res.blob()
    })
    return blob
  } catch {
    return null
  }
}

/** Live user upload for create: IDB blob first, then session URL, then Redux meta. */
export function* loadUserOriginalImageMetaSaga(): SagaIterator<ImageMeta | null> {
  const state = yield select(selectCardphotoState)
  const persisted: ImageMeta | null = state?.userOriginalData ?? null

  const record: ImageRecord | null = yield call(
    [storeAdapters.userImages, 'getById'] as const,
    CURRENT_EDITOR_IMAGE_ID,
  )
  const fromIdb = record?.image ?? null
  const base = fromIdb ?? persisted
  if (!base) return null

  const idbBlob = fromIdb?.full?.blob
  if (idbBlob instanceof Blob) {
    return withBlob(base, idbBlob)
  }

  const persistedBlob = persisted?.full?.blob
  if (persistedBlob instanceof Blob) {
    return withBlob(base, persistedBlob)
  }

  const candidateUrl =
    fromIdb?.full?.url ||
    fromIdb?.url ||
    persisted?.full?.url ||
    persisted?.url ||
    ''
  if (candidateUrl) {
    const fetched: Blob | null = yield call(fetchBlobFromUrl, candidateUrl)
    if (fetched) {
      return withBlob(base, fetched)
    }
  }

  return (
    hydrateMeta(fromIdb) ??
    hydrateSessionImageMeta(persisted, fromIdb) ??
    hydrateMeta(persisted)
  )
}
