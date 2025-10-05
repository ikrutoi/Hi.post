import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectCardPhoto,
  selectCardText,
  selectEnvelope,
  selectCardDate,
  selectCardAroma,
} from '../../infrastructure/selectors/cardEdit.selectors'
import {
  addCardphoto,
  addCardtext,
  addEnvelope,
  addDate,
  addAroma,
} from '../../infrastructure/state/cardEdit.slice'
import type { CardText, Address } from '../../domain/types/cardEdit.types'

export const useCardEdit = () => {
  const dispatch = useAppDispatch()

  const cardPhoto = useSelector(selectCardPhoto)
  const cardText = useSelector(selectCardText)
  const envelope = useSelector(selectEnvelope)
  const date = useSelector(selectCardDate)
  const aroma = useSelector(selectCardAroma)

  return {
    cardPhoto,
    cardText,
    envelope,
    date,
    aroma,
    setCardPhoto: (payload: Partial<typeof cardPhoto>) =>
      dispatch(addCardphoto(payload)),
    setCardText: (payload: Partial<CardText>) => dispatch(addCardtext(payload)),
    setEnvelope: (payload: Partial<{ sender: Address; recipient: Address }>) =>
      dispatch(addEnvelope(payload)),
    setDate: (payload: string | null) => dispatch(addDate(payload)),
    setAroma: (payload: string | null) => dispatch(addAroma(payload)),
  }
}
