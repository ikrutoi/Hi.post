/**
 * Phase 0 — backend inventory vs IndexedDB postcard canon.
 *
 * IndexedDB `postcards` is the product source of truth. Laravel `postcards`
 * (image_path / message / draft|scheduled|sent|archived) is frozen: do not
 * add columns, relations, or write paths. Cloud copy today is an opaque
 * `user_postcard_snapshots.payload` of PostcardHydrated (sync payload v1).
 *
 * Local-only IDB stores (not a server entity): session, uiPreferences,
 * cardPieFavorites, stockImages, userImages, cardphotoImages, applyImage.
 * IDB `sender` object store is deleted. Laravel `sender_templates` stays
 * until a later migration; the client no longer calls it.
 */
export const BACKEND_CANON_PHASE = 0 as const

/** Opaque `user_postcard_snapshots.payload` version (PostcardHydrated[]). */
export const BACKEND_SYNC_PAYLOAD_VERSION = 1 as const

/** IndexedDB AppDB version — postcard row shape Laravel must follow. */
export const BACKEND_APP_DB_VERSION = 20 as const

/** Matches `POSTCARD_STATUSES` on PostcardHydrated.status */
export const BACKEND_POSTCARD_STATUSES = [
  'cart',
  'cartBlocked',
  'ready',
  'sent',
  'delivered',
  'error',
] as const

export type BackendPostcardStatus = (typeof BACKEND_POSTCARD_STATUSES)[number]

export const BACKEND_POSTCARD_REF_KEYS = [
  'cardphoto',
  'cardtext',
  'recipient',
  'aroma',
] as const

export type BackendPostcardRefKey = (typeof BACKEND_POSTCARD_REF_KEYS)[number]

export const BACKEND_ADDRESS_FIELDS = [
  'name',
  'street',
  'zip',
  'city',
  'country',
] as const

/** Laravel tables that must not grow toward the old postcard product model. */
export const FROZEN_LARAVEL_TABLES = [
  'postcards',
  'sender_templates',
] as const

/**
 * Keep for auth / current sync vehicle / unused template CRUD stubs.
 * New postcard schema will not reuse `postcards` columns.
 */
export const LIVE_LARAVEL_TABLES = [
  'users',
  'user_postcard_snapshots',
  'recipient_templates',
  'text_templates',
  'image_templates',
  'personal_access_tokens',
] as const

/** IDB stores that become the new server model (phase 1+). */
export const IDB_CANON_STORES = [
  'postcards',
  'recipient',
  'cardtext',
] as const

export type BackendPostcardCanonRow = {
  id: string
  localId: number
  status: BackendPostcardStatus
  price: string
  createdAt: number
  updatedAt: number
  date: { year: number; month: number; day: number }
  postcard: {
    cardphoto: string
    cardtext: string
    recipient: string
    aroma: string
  }
  card: {
    id: string
    thumbnailUrl: string
    cardphoto: unknown
    cardtext: unknown
    envelope: {
      recipient: unknown
      isComplete: boolean
    }
    aroma: { index: number }
    date: { year: number; month: number; day: number }
  }
}
