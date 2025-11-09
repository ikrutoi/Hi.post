import { useDispatch } from 'react-redux'
import { setAroma, clearAroma } from '../../infrastructure/state'
import type { AromaItem } from '@entities/aroma'

export const useAromaController = () => {
  const dispatch = useDispatch()

  const selectAroma = (item: AromaItem) => {
    dispatch(setAroma(item))
  }

  const resetAroma = () => {
    dispatch(clearAroma())
  }

  const selectByIndex = (index: AromaItem['index'], list: AromaItem[]) => {
    const found = list.find((item) => item.index === index)
    if (found) {
      dispatch(setAroma(found))
    }
  }

  return {
    selectAroma,
    resetAroma,
    selectByIndex,
  }
}
