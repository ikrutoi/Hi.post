import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectCardphoto,
  selectCardphotoUi,
} from '../../infrastructure/selectors'
import { setCardphoto, setCardphotoUi } from '../../infrastructure/state'

export const useCardPhoto = () => {
  const dispatch = useAppDispatch()
  const cardphoto = useSelector(selectCardphoto)
  const cardphotoUi = useSelector(selectCardphotoUi)

  return {
    cardphoto,
    cardphotoUi,
    updateCardphoto: (payload: Partial<typeof cardphoto>) =>
      dispatch(setCardphoto(payload)),
    updateCardphotoUi: (payload: Partial<typeof cardphotoUi>) =>
      dispatch(setCardphotoUi(payload)),
  }
}
