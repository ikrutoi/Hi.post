import { useEffect } from 'react'
import { getRemSize } from '../../helpers/getRemSize'
import { useSizeFacade } from '../facades/'

export const useLayoutInit = () => {
  const { setRemSize } = useSizeFacade()

  useEffect(() => {
    setRemSize(getRemSize())
  }, [setRemSize])
}
