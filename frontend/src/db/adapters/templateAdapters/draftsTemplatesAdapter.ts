import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap } from '@/db/types'
import type { DraftsTemplatesAdapter } from './templatesStoreAdapters'

export const draftsTemplatesAdapter: DraftsTemplatesAdapter =
  createStoreAdapter<TemplateStoreMap['drafts']>('draftsTemplates')
