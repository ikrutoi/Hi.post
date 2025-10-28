import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap, DraftsTemplatesAdapter } from '@/db/types'

export const draftsTemplatesAdapter: DraftsTemplatesAdapter =
  createStoreAdapter<TemplateStoreMap['drafts']>('draftsTemplates')
