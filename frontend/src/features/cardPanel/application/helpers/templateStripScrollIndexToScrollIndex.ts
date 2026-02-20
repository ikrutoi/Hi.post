import type { ScrollIndex } from '../../CardScroller/domain/types'
import type { TemplateStripScrollIndex } from '../../TemplateStrip/domain/types'

/** Приводит TemplateStripScrollIndex к формату ScrollIndex для CardScroller. */
export function templateStripScrollIndexToScrollIndex(
  raw: TemplateStripScrollIndex,
): ScrollIndex {
  return {
    totalCount: raw.totalCount,
    firstLetters: raw.firstLetters.map(({ letter, id, index }) => ({
      id,
      index,
      letter,
    })),
  }
}
