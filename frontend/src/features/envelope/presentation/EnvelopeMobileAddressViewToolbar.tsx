import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { useEnvelopeAddressViewToolbarContent } from './useEnvelopeAddressViewToolbarContent'

type EnvelopeMobileAddressViewToolbarProps = {
  enabled: boolean
}

export const EnvelopeMobileAddressViewToolbar: React.FC<
  EnvelopeMobileAddressViewToolbarProps
> = ({ enabled }) => {
  const isMobile = useAppSelector(selectIsMobileLayout)
  const content = useEnvelopeAddressViewToolbarContent({
    enabled,
    includeHistoryListPeek: true,
  })

  useMobileScenarioToolbar(isMobile && content != null ? content : null)

  return null
}
