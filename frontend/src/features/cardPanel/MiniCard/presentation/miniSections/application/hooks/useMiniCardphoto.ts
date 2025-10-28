import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stockImagesAdapter } from '@/db/adapters/storeAdapters/stockImagesAdapter'
import { userImagesAdapter } from '@/db/adapters/storeAdapters/userImagesAdapter'
import type { RootState } from '@app/state'
import type { IndexedImage } from '@features/cardphoto/domain/types'

export const useMiniCardphoto = () => {
  const layoutIndexDb = useSelector(
    (state: RootState) => state.layout.image.indexDb
  )

  const [miniCardUrl, setMiniCardUrl] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadMiniImage = async () => {
      const [userImages, stockImages] = await Promise.all([
        userImagesAdapter.getAll(),
        stockImagesAdapter.getAll(),
      ])

      const hasUser = userImages.some((img) => img.id === 'miniImage')
      const hasStock = stockImages.some((img) => img.id === 'miniImage')

      let image: IndexedImage | null = null

      if (hasUser) {
        image = await userImagesAdapter.getById('miniImage')
      } else if (hasStock) {
        image = await stockImagesAdapter.getById('miniImage')
      }

      if (image?.image instanceof Blob) {
        setMiniCardUrl(URL.createObjectURL(image.image))
      }
    }

    loadMiniImage()
  }, [layoutIndexDb])

  return { miniCardUrl, isVisible }
}
