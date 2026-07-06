import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useCardtextListTemplateSelect } from '@cardtext/application/hooks/useCardtextListTemplateSelect'
import { setCardtextListPanelOpen } from '@cardtext/infrastructure/state'
import { selectIsCardtextListPanelOpen } from '@cardtext/infrastructure/selectors'
import type { CardtextContent } from '@cardtext/domain/editor/editor.types'
import { CardtextListPanel } from './CardtextListPanel/CardtextListPanel'
import { CardtextListMobileFactoryLowerToolbar } from './CardtextListMobileFactoryToolbar'

export const CardtextListMobileSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsCardtextListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const handleSelectTemplate = useCardtextListTemplateSelect()

  const handleClose = useCallback(() => {
    dispatch(setCardtextListPanelOpen(false))
  }, [dispatch])

  const handleSelect = useCallback(
    (entry: CardtextContent) => {
      handleSelectTemplate(entry)
    },
    [handleSelectTemplate],
  )

  if (!isOpen || !isMobileLayout) return null

  return (
    <>
      <CardtextListMobileFactoryLowerToolbar />
      <CardtextListPanel
        factoryChrome
        onClose={handleClose}
        onSelect={handleSelect}
      />
    </>
  )
}
