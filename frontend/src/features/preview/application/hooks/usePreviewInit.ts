import {} from '@cart/application/'
import {} from '@drafts/application/facades'
import { useCardphotoPreview } from './useCardphotoPreview'

export const usePreviewInit = () => {
  const { cartItems } = useCartFacade()
  const { draftItems } = useDraftFacade()

  useCardphotoPreview({ items: cartItems })
  useCardphotoPreview({ items: draftItems })
}
