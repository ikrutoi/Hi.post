import type { DateListPanelItem } from '@date/presentation/DateListPanel'
import { parseDispatchBranchKey } from '@date/domain/dispatchBranchKey'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { selectActiveCardFullData } from './selectors/cardPieSelectors'
import {
  buildDatePreviewLines,
  buildPieSectionFlagsFromInner,
  buildRecipientPreviewLines,
  type CardPieInnerBuildContext,
  type CardPieInnerData,
  type CardPieSectionFlags,
  resolveAddressForRecipientId,
} from './postcardCardPieViewModel'
import { createInitialCardtextContent } from '@cardtext/domain/editor/editor.types'

export const DEFAULT_MOBILE_PLAN_PIE_ID = 'default-plan-pie'

export function emptyCardPieInnerData(): CardPieInnerData {
  return {
    cardphoto: {
      previewUrl: null,
      factoryDisplayUrl: null,
      isComplete: false,
      id: 'empty',
    },
    cardtext: createInitialCardtextContent(),
    recipient: null,
    recipientCount: 0,
    recipientPreviewLines: [],
    datePreviewLines: [],
    senderBadgeShow: false,
    senderDisplayName: null,
    hasSenderAppliedData: false,
    sender: null,
    aroma: null,
    date: null,
    dates: [],
  }
}

export function cardPieInnerFromEditorActiveData(
  active: ReturnType<typeof selectActiveCardFullData>,
): CardPieInnerData | null {
  const d = active?.data
  if (d == null) return null
  const cardphoto = d.cardphoto
  return {
    cardphoto: {
      previewUrl: cardphoto?.previewUrl ?? null,
      factoryDisplayUrl: cardphoto?.previewUrl ?? null,
      isComplete: Boolean(cardphoto?.isComplete),
      id: cardphoto?.id ?? 'empty',
    },
    cardtext: d.cardtext,
    recipient: d.recipient,
    recipientCount: d.recipientCount ?? 0,
    recipientPreviewLines: d.recipientPreviewLines ?? [],
    datePreviewLines: d.datePreviewLines ?? [],
    senderBadgeShow: false,
    senderDisplayName: null,
    hasSenderAppliedData: d.hasSenderAppliedData ?? false,
    sender: null,
    aroma: d.aroma ?? null,
    date: d.date ?? null,
    dates: d.dates ?? [],
  }
}

export function buildCardPieInnerDataForPlanEntry(
  entry: DateListPanelItem,
  base: CardPieInnerData,
  options: {
    recipientState: RecipientState
    envelopeComplete: boolean
    ctx: CardPieInnerBuildContext
  },
): { inner: CardPieInnerData; sections: CardPieSectionFlags } {
  const parsed = entry.dispatchBranchKey
    ? parseDispatchBranchKey(entry.dispatchBranchKey)
    : null
  const date = entry.sourceDate ?? parsed?.date ?? null
  const dates = date != null ? [date] : []
  const recipientSlotKey = parsed?.recipientSlotKey ?? 'session'

  let recipient = base.recipient
  if (recipientSlotKey !== 'session') {
    recipient = resolveAddressForRecipientId(
      recipientSlotKey,
      options.ctx.envelopeRecipients ?? [],
      options.ctx.recipientEntries ?? [],
    )
  } else if (recipient == null && options.recipientState.appliedData != null) {
    recipient = options.recipientState.appliedData
  }

  const recipientCount = recipient != null ? 1 : 0
  const inner: CardPieInnerData = {
    ...base,
    date,
    dates,
    datePreviewLines: buildDatePreviewLines(dates),
    recipient,
    recipientCount,
    recipientPreviewLines:
      recipientCount > 1
        ? buildRecipientPreviewLines(options.recipientState, options.ctx)
        : [],
  }

  return {
    inner,
    sections: buildPieSectionFlagsFromInner(inner, options.envelopeComplete),
  }
}
