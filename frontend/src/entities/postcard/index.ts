export type {
  Postcard,
  PostcardHydrated,
  PostcardRecordMeta,
  PostcardRefs,
  PostcardsDaySummary,
  PostcardStatus,
} from './domain/types/postcard.types'
export {
  normalizePostcardRecord,
  postcardRefsFromCard,
  POSTCARD_STATUSES,
  POSTCARD_STATUSES_HIDDEN_ON_DATE_CALENDAR_THUMBNAIL,
  POSTCARD_DISPATCH_DATE_FALLBACK,
} from './domain/types/postcard.types'
export { anyPostcardReferencesCardtextTemplateId } from './domain/postcardReferencesCardtextTemplate'
