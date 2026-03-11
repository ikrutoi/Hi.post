import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types/storeMap.types'

/** Адаптер списка карточек в IndexedDB. Один store «cards»; фильтрация по status — в коде. */
export const cardsStoreAdapter = createStoreAdapter<StoreMap['cards']>('cards')
