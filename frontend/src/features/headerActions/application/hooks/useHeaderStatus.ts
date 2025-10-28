import { useEffect, useState } from 'react'
import { useAppDispatch } from '@app/hooks'
import { fetchHeaderStatus } from '../../infrastructure/services'
import type { StatusType } from '../../domain/types'

export const useHeaderStatus = () => {
  const dispatch = useAppDispatch
  const [status, setStatus] = useState<StatusType>({
    cart: false,
    clip: false,
    clipId: '',
  })
  const [cartCount, setCartCount] = useState(0)
  const [draftsCount, setDraftsCount] = useState(0)

  useEffect(() => {
    fetchHeaderStatus(dispatch).then(({ status, cartCount, draftsCount }) => {
      setStatus(status)
      setCartCount(cartCount)
      setDraftsCount(draftsCount)
    })
  }, [dispatch])

  return { status, cartCount, draftsCount }
}
