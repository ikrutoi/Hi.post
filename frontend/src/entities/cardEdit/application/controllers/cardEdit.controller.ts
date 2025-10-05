import {
  addCardphoto,
  addCardtext,
  addEnvelope,
  addDate,
  addAroma,
} from '../../infrastructure/state/cardEdit.slice'
import type { AppDispatch } from '@app/state'
import type { CardText, Address } from '../../domain/types/cardEdit.types'

export const cardEditController = (dispatch: AppDispatch) => ({
  updatePhoto: (payload: Partial<{ url: string; source: string }>) =>
    dispatch(addCardphoto(payload)),
  updateText: (payload: Partial<CardText>) => dispatch(addCardtext(payload)),
  updateEnvelope: (payload: Partial<{ sender: Address; recipient: Address }>) =>
    dispatch(addEnvelope(payload)),
  updateDate: (payload: string | null) => dispatch(addDate(payload)),
  updateAroma: (payload: string | null) => dispatch(addAroma(payload)),
})
