import { AppDispatch } from '@app/state/store'
import { createStoreAdapter } from '@db/publicApi'
import { StoreMap } from '@db/publicApi'
import { addIndexDb } from '@store/slices/layoutSlice'

export const checkIndexDb = async (dispatch: AppDispatch) => {
  const stockImagesAdapter =
    createStoreAdapter<StoreMap['stockImages']>('stockImages')
  const stockImages = await stockImagesAdapter.getAll()

  const userImagesAdapter =
    createStoreAdapter<StoreMap['userImages']>('userImages')
  const userImages = await userImagesAdapter.getAll()

  const checkImages = (base: any[]) => ({
    originalImage: base.some((img) => img.id === 'originalImage'),
    workingImage: base.some((img) => img.id === 'workingImage'),
    miniImage: base.some((img) => img.id === 'miniImage'),
  })

  const stock = checkImages(stockImages)
  const user = checkImages(userImages)

  if (user.originalImage && stock.workingImage) {
    await stockImagesAdapter.deleteById('workingImage')
  }
  if (user.miniImage && stock.miniImage) {
    await userImagesAdapter.deleteById('miniImage')
  }

  dispatch(addIndexDb({ stockImages: stock, userImages: user }))
}
