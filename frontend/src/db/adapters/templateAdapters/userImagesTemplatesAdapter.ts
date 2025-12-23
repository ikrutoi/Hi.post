import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { ImageTemplateItem } from '@/features/cardphoto/domain/typesLayout'
import type { StoreAdapter } from '../../types'

export interface UserImagesTemplatesAdapter extends StoreAdapter<ImageTemplateItem> {
  addTemplate(template: ImageTemplateItem): Promise<void>
}

const base = createStoreAdapter<ImageTemplateItem>('userImages')

export const userImagesTemplatesAdapter: UserImagesTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const localId = (await base.getMaxLocalId()) + 1
    await base.put({ ...template, localId })
  },
}
