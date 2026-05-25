import type { PostcardHydrated } from '@entities/postcard'

export function cardphotoAppliedIdFromPostcard(
  p: PostcardHydrated,
): string | null {
  const id = p.card.cardphoto?.appliedData?.id
  return typeof id === 'string' && id.trim() !== '' ? id : null
}

/** Фото всё ещё нужно открыткам (корзина / история / календарь). */
export function isCardphotoImageIdUsedByPostcards(
  postcards: readonly PostcardHydrated[],
  imageId: string,
): boolean {
  if (!imageId.trim()) return false
  for (const p of postcards) {
    if (cardphotoAppliedIdFromPostcard(p) === imageId) return true
    const [prefix] = p.card.id.split('__')
    if (prefix === imageId) return true
  }
  return false
}
