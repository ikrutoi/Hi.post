import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectLayoutUi,
  selectMiniAddressClose,
  selectNavHistory,
  selectEnvelopeSave,
  selectEnvelopeSaveSecond,
  selectEnvelopeRemoveAddress,
  selectCardphotoClick,
  selectCartStatus,
} from '../../infrastructure/selectors'
import { updateLayoutUi, resetLayoutUi } from '../../infrastructure/state'
import type { LayoutUiState } from '../../domain/types'

export const useLayoutUi = () => {
  const dispatch = useAppDispatch()
  const layoutUi = useSelector(selectLayoutUi)

  return {
    layoutUi,
    miniAddressClose: useSelector(selectMiniAddressClose),
    navHistory: useSelector(selectNavHistory),
    envelopeSave: useSelector(selectEnvelopeSave),
    envelopeSaveSecond: useSelector(selectEnvelopeSaveSecond),
    envelopeRemoveAddress: useSelector(selectEnvelopeRemoveAddress),
    cardphotoClick: useSelector(selectCardphotoClick),
    shoppingStatus: useSelector(selectCartStatus),
    updateLayoutUi: (payload: Partial<LayoutUiState>) =>
      dispatch(updateLayoutUi(payload)),
    resetLayoutUi: () => dispatch(resetLayoutUi()),
  }
}
