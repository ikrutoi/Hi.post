import { useDispatch } from 'react-redux'
import { setSliderLine } from '@store/slices/layoutSlice'

export const useSliderLine = () => {
  const dispatch = useDispatch()

  const updateSliderLine = (value: number) => {
    dispatch(setSliderLine(String(value)))
  }

  return { updateSliderLine }
}
