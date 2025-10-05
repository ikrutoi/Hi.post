import { useSelector } from 'react-redux'

export const useCardScrollerState = () => {
  const infoDeltaEnd = useSelector((state: any) => state.layout.setDeltaEnd)
  return { infoDeltaEnd }
}
