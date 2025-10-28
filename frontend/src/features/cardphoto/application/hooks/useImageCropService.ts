import { imageAdapter } from '@db/adapters/factory'
import { checkImages } from '../../domain/logic'

export const fetchIndexDbImages = async () => {
  const stockImages = await imageAdapter.stockImages.getAll()
  const userImages = await imageAdapter.userImages.getAll()

  return {
    stockImages,
    userImages,
    listStockImages: checkImages(stockImages),
    listUserImages: checkImages(userImages),
  }
}

export const fetchStartImage = async (
  imageStore: 'stockImages' | 'userImages',
  id: string
): Promise<Blob | null> => {
  const record = await imageAdapter[imageStore].getById(id)
  return record?.image ?? null
}

export const saveImageToDb = async (
  imageStore: 'stockImages' | 'userImages',
  id: string,
  blob: Blob
) => {
  await imageAdapter[imageStore].put({ id, image: blob })
}

export const deleteImageFromDb = async (
  imageStore: 'stockImages' | 'userImages',
  id: string
) => {
  await imageAdapter[imageStore].deleteById(id)
}
