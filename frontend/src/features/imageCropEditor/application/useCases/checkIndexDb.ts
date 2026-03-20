import type { AppDispatch } from '@app/state/store'
import { createStoreAdapter } from '@db/publicApi'
import type { StoreMap } from '@db/publicApi'
import { addIndexDb } from '@store/slices/layoutSlice'

export const checkIndexDb = async (dispatch: AppDispatch) => {
  const stockAdapter =
    createStoreAdapter<StoreMap['stockImages']>('stockImages')
  const userAdapter = createStoreAdapter<StoreMap['userImages']>('userImages')

  const stockImages = await stockAdapter.getAll()
  const userImages = await userAdapter.getAll()

  const checkImages = (base: any[]) => ({
    originalImage: base.some((img) => img.id === 'originalImage'),
    workingImage: base.some((img) => img.id === 'workingImage'),
    miniImage: base.some((img) => img.id === 'miniImage'),
  })

  const stock = checkImages(stockImages)
  const user = checkImages(userImages)

  if (user.originalImage && stock.workingImage) {
    await stockAdapter.deleteById('workingImage')
  }
  if (user.miniImage && stock.miniImage) {
    await userAdapter.deleteById('miniImage')
  }

  dispatch(addIndexDb({ stockImages: stock, userImages: user }))
}
