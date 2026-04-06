import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap } from '@/db/types'
import type { CartTemplatesAdapter } from './templatesStoreAdapters'

export const cartTemplatesAdapter: CartTemplatesAdapter =
  createStoreAdapter<TemplateStoreMap['cart']>('cartTemplates')
