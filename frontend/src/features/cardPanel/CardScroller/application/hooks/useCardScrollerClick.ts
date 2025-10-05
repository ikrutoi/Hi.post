import { useDispatch } from 'react-redux'

import { setSliderLetter } from '../../../store/slices/layoutSlice'

export const useCardScrollerClick = (
  setIndex: (i: number) => void,
  onChange: (index: number | string) => void
) => {
  const dispatch = useDispatch()

  return (evt: React.MouseEvent<HTMLSpanElement>) => {
    const { textContent, dataset } = evt.target as HTMLSpanElement
    if (textContent) {
      dispatch(
        setSliderLetter({
          letter: textContent,
          id: dataset.id,
          index: dataset.index,
        })
      )
      setIndex(Number(dataset.index))
      onChange(dataset.index || 0)
    }
  }
}
