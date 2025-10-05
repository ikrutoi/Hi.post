import { useSelector } from 'react-redux'
import { useAppDispatch } from '@app/hooks'
import {
  selectToolbar,
  selectCardphotoToolbar,
  selectCardtextToolbar,
  selectEnvelopeToolbar,
  selectFullCardToolbar,
} from '../../infrastructure/selectors'
import { useToolbarController } from '../../application/controllers'
import { useToolbarUI } from '../ui'
import type { CardSectionName } from '@shared/types'

export const useToolbarFacade = (section: CardSectionName) => {
  const dispatch = useAppDispatch()
  const toolbar = useSelector(selectToolbar)
  const cardphoto = useSelector(selectCardphotoToolbar)
  const cardtext = useSelector(selectCardtextToolbar)
  const envelope = useSelector(selectEnvelopeToolbar)
  const fullCard = useSelector(selectFullCardToolbar)

  const actions = useToolbarController(dispatch)
  const ui = useToolbarUI(section)

  return {
    toolbar,
    cardphoto,
    cardtext,
    envelope,
    fullCard,
    actions,
    ui,
  }
}
