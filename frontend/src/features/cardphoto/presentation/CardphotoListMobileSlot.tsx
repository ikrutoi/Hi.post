import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import {
  selectInLineTemplate,
  setCardphotoListPanelOpen,
} from '@cardphoto/infrastructure/state'
import { selectIsListPanelOpen } from '@cardphoto/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { CardphotoListPanel } from './CardphotoListPanel/CardphotoListPanel'

export const CardphotoListMobileSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsListPanelOpen)
  const { isMobileLayout } = useSizeFacade()

  const handleClose = useCallback(() => {
    dispatch(setCardphotoListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'listCardphoto',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleSelectTemplate = useCallback(
    (id: string) => {
      dispatch(selectInLineTemplate(id))
      handleClose()
    },
    [dispatch, handleClose],
  )

  if (!isOpen || !isMobileLayout) return null

  return (
    <CardphotoListPanel
      onClose={handleClose}
      onSelectTemplate={handleSelectTemplate}
    />
  )
}
