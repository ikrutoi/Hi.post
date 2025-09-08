import { indexDbService } from '@db/adapters/factory/indexDbService'
import { checkImages } from '../domain/logic'

export const fetchIndexDbImages = async () => {
  const stockImages = await indexDbService.stockImages.getAll()
  const userImages = await indexDbService.userImages.getAll()

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
  const record = await indexDbService[imageStore].getById(id)
  return record?.image ?? null
}

export const saveImageToDb = async (
  imageStore: 'stockImages' | 'userImages',
  id: string,
  blob: Blob
) => {
  await indexDbService[imageStore].put({ id, image: blob })
}

export const deleteImageFromDb = async (
  imageStore: 'stockImages' | 'userImages',
  id: string
) => {
  await indexDbService[imageStore].deleteById(id)
}
