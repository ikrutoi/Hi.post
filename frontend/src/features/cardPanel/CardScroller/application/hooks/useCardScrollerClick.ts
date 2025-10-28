import { useDispatch } from 'react-redux'
import { useLayoutFacade } from '@layout/application/facades'

export const useCardScrollerClick = (
  setIndex: (i: number) => void,
  onChange: (index: number | string) => void
) => {
  const dispatch = useDispatch()
  const {
    actions: { setSliderLetter },
  } = useLayoutFacade()

  return (evt: React.MouseEvent<HTMLSpanElement>) => {
    const { textContent, dataset } = evt.target as HTMLSpanElement
    if (textContent && dataset.id && dataset.index) {
      dispatch(
        setSliderLetter({
          letter: textContent,
          id: dataset.id,
          index: dataset.index,
        })
      )
      setIndex(Number(dataset.index))
      onChange(dataset.index)
    }
  }
}
