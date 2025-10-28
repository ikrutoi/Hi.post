import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { ImageTemplateItem } from '@cardphoto/domain/types'
import type { StoreAdapter } from '../../types'

export interface StockImagesTemplatesAdapter
  extends StoreAdapter<ImageTemplateItem> {
  addTemplate(template: ImageTemplateItem): Promise<void>
}

const base = createStoreAdapter<ImageTemplateItem>('stockImages')

export const stockImagesTemplatesAdapter: StockImagesTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const localId = (await base.getMaxLocalId()) + 1
    await base.put({ ...template, localId })
  },
}
