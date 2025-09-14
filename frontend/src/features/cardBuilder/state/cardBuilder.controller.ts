import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  setCardphoto,
  setCardtext,
  setEnvelope,
  setDate,
  setAroma,
} from './cardBuilder.slice'
import { selectCardBuilder } from './cardBuilder.selectors'

export const useCardBuilderController = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector(selectCardBuilder)

  return {
    state,
    setCardphoto: (payload: Partial<typeof state.cardphoto>) =>
      dispatch(setCardphoto(payload)),
    setCardtext: (payload: Partial<typeof state.cardtext>) =>
      dispatch(setCardtext(payload)),
    setEnvelope: (payload: Partial<typeof state.envelope>) =>
      dispatch(setEnvelope(payload)),
    setDate: (date: string) => dispatch(setDate(date)),
    setAroma: (aroma: string | null) => dispatch(setAroma(aroma)),
  }
}
