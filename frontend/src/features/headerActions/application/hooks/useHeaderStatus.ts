import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import type { AppDispatch } from '@app/state'
import { fetchHeaderStatus } from '../../infrastructure/services'
import type { StatusType } from '../../domain/types'

export const useHeaderStatus = () => {
  const dispatch = useDispatch<AppDispatch>()
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
