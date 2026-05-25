/** Префикс `card.id` / `postcard.id`: `{imageMetaId}__{localId|date…}`. */
export function imageMetaIdFromCardId(cardId: string | undefined): string | null {
  if (!cardId || cardId === 'current_session') return null
  const [imageMetaId] = cardId.split('__')
  return imageMetaId || null
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

  const allowBlob = input.allowBlobPreview ?? false

  return (
    pickPreviewUrl(input.registryThumbUrl, allowBlob) ||
    pickPreviewUrl(input.registryUrl, allowBlob) ||
    pickPreviewUrl(input.previewUrl, allowBlob)
  )
}
