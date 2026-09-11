/** Префикс `card.id` / `postcard.id`: `{imageMetaId}__{localId|date…}`. */
export function imageMetaIdFromCardId(cardId: string | undefined): string | null {
  if (!cardId || cardId === 'current_session') return null
  const [imageMetaId] = cardId.split('__')
  return imageMetaId || null
}

/** ID для IDB/registry: `appliedData.id` и префикс `card.id` могут расходиться после re-apply. */
export function cardImageMetaLookupIds(
  cardId: string | undefined,
  appliedMetaId: string | null | undefined,
): string[] {
  const ids = new Set<string>()
  const applied = appliedMetaId?.trim()
  if (applied) ids.add(applied)
  const prefix = imageMetaIdFromCardId(cardId)
  if (prefix) ids.add(prefix)
  return [...ids]
}

export function isPersistedBlobUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.startsWith('blob:')
}

export type ListPreviewDisplayInput = {
  cachedUrl: string | null
  previewUrl: string | null
  registryThumbUrl?: string | null
  registryUrl?: string | null
}

function pickPreviewUrl(
  url: string | null | undefined,
  allowBlobPreview: boolean,
): string | null {
  const t = url?.trim()
  if (!t) return null
  if (isPersistedBlobUrl(t) && !allowBlobPreview) return null
  return t
}

export type ListPreviewDisplayOptions = {
  /** Живой blob: из редактора / current_session (не переживает reload). */
  allowBlobPreview?: boolean
}

/** URL для `<img>`: кэш саги (в т.ч. свежий blob:) → registry → http(s)/data. */
export function resolveListPreviewDisplayUrl(
  input: ListPreviewDisplayInput & ListPreviewDisplayOptions,
): string | null {
  const cached = input.cachedUrl?.trim()
  if (cached) return cached

  const allowPersistedBlob = input.allowBlobPreview ?? false

  /** Registry blobs are recreated on hydrate — always usable in-session. */
  return (
    pickPreviewUrl(input.registryThumbUrl, true) ||
    pickPreviewUrl(input.registryUrl, true) ||
    pickPreviewUrl(input.previewUrl, allowPersistedBlob)
  )
}
