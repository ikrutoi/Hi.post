import { useState, useEffect } from 'react'
import { cartAdapter } from '@features/cart/model/adapters/cartAdapter'
import { resizeImage } from 'shared-legacy/lib/image/resizeImage'
import type { CartPostcard } from '@features/cart/domain'

export const useCartPreviewForCalendar = (targetDate: string | null) => {
  const [cartPreview, setCartPreview] = useState<CartPostcard[]>([])

  const getCartForDate = async () => {
    if (!targetDate) return

    const cartItems = await cartAdapter.getAll()
    const filtered = cartItems.filter((item) => item.date === targetDate)

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

  useEffect(() => {
    getCartForDate()
  }, [targetDate])

  return { cartPreview }
}
