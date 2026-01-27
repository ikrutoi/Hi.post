import type { StoreAdapter } from './storeAdapter.types'
import type { TemplateStoreMap } from './storeMap.types'

export interface UserImagesAdapter extends StoreAdapter<
  TemplateStoreMap['userImages']
> {}
