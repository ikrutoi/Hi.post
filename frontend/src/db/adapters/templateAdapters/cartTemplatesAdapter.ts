import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap, CartTemplatesAdapter } from '../../types'

export const cartTemplatesAdapter: CartTemplatesAdapter =
  createStoreAdapter<TemplateStoreMap['cart']>('cartTemplates')
