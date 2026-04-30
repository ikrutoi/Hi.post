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
  POSTCARD_DISPATCH_DATE_FALLBACK,
} from './domain/types/postcard.types'
