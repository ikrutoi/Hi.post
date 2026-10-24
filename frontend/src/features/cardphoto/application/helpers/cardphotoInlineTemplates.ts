import { storeAdapters } from '@db/adapters/storeAdapters'
import type { ImageMeta } from '@cardphoto/domain/types'
import { resolveCardphotoListThumbSrc } from './cardphotoListThumbCache'

let membershipGeneration = 0
/** After unstar, a slower recount must not paint a higher badge. */
let badgeUpperBound: number | null = null

/** Bump after an inLine add/remove so an older IDB read cannot rewrite the badge. */
export function noteCardphotoInlineMembershipChanged(): void {
  membershipGeneration += 1
}

export function holdCardphotoListBadgeUpperBound(max: number): void {
  badgeUpperBound = max
}

export function releaseCardphotoListBadgeUpperBound(): void {
  badgeUpperBound = null
}

export function cardphotoListBadgeUpperBound(): number | null {
  return badgeUpperBound
}

export function beginCardphotoInlineBadgeRead(): number {
  return membershipGeneration
}

export function isCurrentCardphotoInlineBadgeRead(generation: number): boolean {
  return generation === membershipGeneration
}

/** Same rows the photo template list renders: inLine and a visible thumb. */
export async function readCardphotoInlineTemplates(): Promise<ImageMeta[]> {
  const all = await storeAdapters.cardphotoImages.getAll()
  const inline = all.filter((row) => row.status === 'inLine')
  const visible: ImageMeta[] = []
  for (const row of inline) {
    try {
      const src = await resolveCardphotoListThumbSrc(row)
      if (src) visible.push(row)
    } catch {
      // CardphotoListPanel skips this template too.
    }
  }
  return visible
}
