import { useEffect } from 'react'
import { getRemSize } from '../../helpers/getRemSize'
import { useLayoutFacade } from '../facades/useLayoutFasade'

export const useLayoutInit = () => {
  const { actions } = useLayoutFacade()

  useEffect(() => {
    actions.setRemSize(getRemSize())
  }, [actions.setRemSize])
}
