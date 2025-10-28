import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectToolbar,
  selectCardphotoToolbar,
  selectCardtextToolbar,
  selectEnvelopeToolbar,
  // selectFullCardToolbar,
} from '../../infrastructure/selectors'
import { updateToolbar, resetToolbar } from '../../infrastructure/state'
import type { ToolbarState } from '../../domain/types'

export const useToolbar = () => {
  const dispatch = useAppDispatch()
  const toolbar = useSelector(selectToolbar)
  const cardphoto = useSelector(selectCardphotoToolbar)
  const cardtext = useSelector(selectCardtextToolbar)
  const envelope = useSelector(selectEnvelopeToolbar)
  // const fullCard = useSelector(selectFullCardToolbar)

  return {
    toolbar,
    cardphoto,
    cardtext,
    envelope,
    // fullCard,
    updateToolbar: (payload: Partial<ToolbarState>) =>
      dispatch(updateToolbar(payload)),
    resetToolbar: () => dispatch(resetToolbar()),
  }
}
