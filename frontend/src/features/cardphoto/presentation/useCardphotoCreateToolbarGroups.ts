import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { CARDPHOTO_CREATE_TOOLBAR } from '@toolbar/domain/types/cardphoto.types'
import type { ToolbarConfig } from '@toolbar/domain/types'

/** Lower create row: crop row + delete when crop is idle (mobile + desktop). */
export function useCardphotoCreateToolbarGroups(): ToolbarConfig | undefined {
  const createToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoCreate'),
  )
  const isCreateCropActive = createToolbarState?.crop?.state === 'active'

  return useMemo(() => {
    if (isCreateCropActive) {
      return undefined
    }
    return [
      ...CARDPHOTO_CREATE_TOOLBAR,
      {
        group: 'close' as const,
        icons: [{ key: 'delete' as const, state: 'enabled' as const }],
        status: 'enabled' as const,
      },
    ]
  }, [isCreateCropActive])
}
