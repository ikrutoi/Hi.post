import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectToolbar,
  selectCardphotoToolbar,
  selectCardtextToolbar,
  selectSenderToolbar,
  selectRecipientToolbar,
  // selectFullCardToolbar,
} from '../../infrastructure/selectors'
import { updateToolbar, resetToolbar } from '../../infrastructure/state'
import type { ToolbarState } from '../../domain/types'

export const useToolbar = () => {
  const dispatch = useAppDispatch()
  const toolbar = useSelector(selectToolbar)
  const cardphoto = useSelector(selectCardphotoToolbar)
  const cardtext = useSelector(selectCardtextToolbar)
  const sender = useSelector(selectSenderToolbar)
  const recipient = useSelector(selectRecipientToolbar)
  // const fullCard = useSelector(selectFullCardToolbar)

  return {
    toolbar,
    cardphoto,
    cardtext,
    sender,
    recipient,
    // fullCard,
    updateToolbar: (payload: Partial<ToolbarState>) =>
      dispatch(updateToolbar(payload)),
    resetToolbar: () => dispatch(resetToolbar()),
  }
}
