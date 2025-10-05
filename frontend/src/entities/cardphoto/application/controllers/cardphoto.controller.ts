import type { AppDispatch } from '@app/state'
import { setCardphoto, setCardphotoUi } from '../../infrastructure/state'

export const cardphotoController = (dispatch: AppDispatch) => ({
  updateCardphoto: (payload: { url?: string | null; source?: string | null }) =>
    dispatch(setCardphoto(payload)),
  updateCardphotoUi: (
    payload: Partial<ReturnType<typeof setCardphotoUi>['payload']>
  ) => dispatch(setCardphotoUi(payload)),
})
