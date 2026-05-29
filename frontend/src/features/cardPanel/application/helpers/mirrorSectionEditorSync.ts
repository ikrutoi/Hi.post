import type { CardPanelSection } from '@cardPanel/domain/types'
import type {
  CardPieInnerData,
  CardPieSectionFlags,
} from '@features/cardPie/infrastructure/postcardCardPieViewModel'
import { cardtextHasRenderableContent } from '@cardtext/domain/editor/editor.types'
import type { AddressFields } from '@shared/config/constants'
import type { DispatchDate } from '@entities/date'
import {
  isDispatchDateDisabledForOrder,
  type OrderCalendarCurrentDate,
} from '@entities/date/utils'
import type { PostcardHydrated, PostcardStatus } from '@entities/postcard'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import type { ImageMeta } from '@cardphoto/domain/types'
import { getCurrentDate } from '@shared/utils/date'

/** Как `isCartDateDisabled` в правом CardPie: дата в корзине слишком ранняя для заказа. */
export function isMirrorArchiveDateDisabledForOrder(
  dates: DispatchDate[],
  postcardStatus: PostcardStatus | undefined,
  currentDate: OrderCalendarCurrentDate = getCurrentDate(),
): boolean {
  if (dates.length === 0) return false
  if (postcardStatus !== 'cart' && postcardStatus !== 'cartBlocked') {
    return false
  }
  return dates.every((d) => isDispatchDateDisabledForOrder(d, currentDate))
}

export function canApplyMirrorSection(
  section: CardPanelSection,
  mirrorInner: CardPieInnerData | null,
  mirrorSectionFlags: CardPieSectionFlags | null,
  postcardStatus?: PostcardStatus,
): boolean {
  if (!mirrorInner || !mirrorSectionFlags) return false
  if (section === 'cardtext') {
    return cardtextHasRenderableContent(mirrorInner.cardtext)
  }
  if (section === 'date') {
    if (!mirrorSectionFlags.date) return false
    return !isMirrorArchiveDateDisabledForOrder(
      mirrorInner.dates ?? [],
      postcardStatus,
    )
  }
  return Boolean(mirrorSectionFlags[section])
}

function sameAddress(
  a: Readonly<AddressFields> | null | undefined,
  b: Readonly<AddressFields> | null | undefined,
): boolean {
  if (a == null && b == null) return true
  if (a == null || b == null) return false
  return (
    String(a.name ?? '') === String(b.name ?? '') &&
    String(a.street ?? '') === String(b.street ?? '') &&
    String(a.city ?? '') === String(b.city ?? '') &&
    String(a.zip ?? '') === String(b.zip ?? '') &&
    String(a.country ?? '') === String(b.country ?? '')
  )
}

function sameDates(a: DispatchDate[], b: DispatchDate[]): boolean {
  if (a.length !== b.length) return false
  return a.every((d, i) => {
    const x = b[i]
    return d.year === x.year && d.month === x.month && d.day === x.day
  })
}

export type MirrorSectionEditorSnapshot = {
  cardphotoAppliedData: ImageMeta | null | undefined
  cardtextApplied: CardtextContent | null | undefined
  appliedRecipientAddress: Readonly<AddressFields> | null | undefined
  appliedSenderAddress: Readonly<AddressFields> | null | undefined
  selectedAroma: AromaItem | null | undefined
  selectedDates: DispatchDate[]
}

export function listMirrorSectionsEligibleForApply(
  sections: readonly CardPanelSection[],
  mirrorInner: CardPieInnerData | null,
  mirrorSectionFlags: CardPieSectionFlags | null,
  postcardStatus?: PostcardStatus,
): CardPanelSection[] {
  if (!mirrorInner || !mirrorSectionFlags) return []
  return sections.filter((section) =>
    canApplyMirrorSection(
      section,
      mirrorInner,
      mirrorSectionFlags,
      postcardStatus,
    ),
  )
}

/** Все секции, которые можно взять с правого CardPie, уже совпадают с левым редактором. */
export function areAllEligibleMirrorSectionsApplied(
  sections: readonly CardPanelSection[],
  mirrorInner: CardPieInnerData | null,
  mirrorSectionFlags: CardPieSectionFlags | null,
  sourcePostcard: PostcardHydrated | null,
  editor: MirrorSectionEditorSnapshot,
  postcardStatus?: PostcardStatus,
): boolean {
  const eligible = listMirrorSectionsEligibleForApply(
    sections,
    mirrorInner,
    mirrorSectionFlags,
    postcardStatus ?? sourcePostcard?.status,
  )
  if (eligible.length === 0) return false
  return eligible.every((section) =>
    isMirrorSectionAppliedToEditor(
      section,
      mirrorInner,
      sourcePostcard,
      editor,
    ),
  )
}

/** Секция редактора уже совпадает с данными открытки из списка (cardPieCopy). */
export function isMirrorSectionAppliedToEditor(
  section: CardPanelSection,
  mirrorInner: CardPieInnerData | null,
  sourcePostcard: PostcardHydrated | null,
  editor: MirrorSectionEditorSnapshot,
): boolean {
  if (!mirrorInner) return false

  switch (section) {
    case 'cardphoto': {
      const sourceMeta =
        sourcePostcard?.card?.cardphoto?.appliedData ??
        sourcePostcard?.card?.cardphoto?.assetData ??
        null
      if (!sourceMeta) return false
      return sourceMeta.id === editor.cardphotoAppliedData?.id
    }
    case 'cardtext': {
      const src = mirrorInner.cardtext
      const applied = editor.cardtextApplied
      if (!src || !applied) return false
      if (src.id != null && applied.id != null) {
        return String(src.id) === String(applied.id)
      }
      return (
        src.plainText === applied.plainText &&
        src.cardtextLines === applied.cardtextLines
      )
    }
    case 'envelope':
      return (
        sameAddress(mirrorInner.recipient ?? null, editor.appliedRecipientAddress) &&
        sameAddress(mirrorInner.sender ?? null, editor.appliedSenderAddress)
      )
    case 'aroma':
      return (
        (mirrorInner.aroma?.index ?? null) === (editor.selectedAroma?.index ?? null)
      )
    case 'date':
      return sameDates(mirrorInner.dates ?? [], editor.selectedDates)
    default:
      return false
  }
}
