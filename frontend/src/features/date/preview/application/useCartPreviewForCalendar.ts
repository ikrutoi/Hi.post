import { useState, useEffect } from 'react'
import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import { resizeImage } from '@shared/utils/image/resizeImage'
import { isSameDispatchDate } from '@entities/date/utils'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartItem } from '@cart/domain/types'

export const useCartPreviewForCalendar = (targetDate: DispatchDate | null) => {
  const [cartPreview, setCartPreview] = useState<CartItem[]>([])
  const cartAdapter = createStoreAdapter<CartItem>('cart')

  useEffect(() => {
    const getCartForDate = async () => {
      if (!targetDate) return

      const cartItems = await cartAdapter.getAll()
      const filtered = cartItems.filter((item) =>
        isSameDispatchDate(item.date, targetDate)
      )
      const prepared = await Promise.all(
        filtered.map(async (item) => {
          try {
            const response = await fetch(item.preview)
            const blob = await response.blob()
            const resizedPreview = await resizeImage(blob)
            return { ...item, preview: resizedPreview }
          } catch {
            return item
          }
        })
      )

      setCartPreview(prepared)
    }

    getCartForDate()
  }, [targetDate])

  return { cartPreview }
}
