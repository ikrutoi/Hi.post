// src/features/date/model/store.ts
import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Cart } from '@/draft/cart/model/types'

export const cartStore = createStoreAdapter<Cart>('cart')
