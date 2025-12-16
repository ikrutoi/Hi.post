import { createAction } from '@reduxjs/toolkit'
import type { ToolbarSection } from '../../domain/types'
import type { IconKey } from '@shared/config/constants'

export const toolbarAction = createAction<{
  section: ToolbarSection
  key: IconKey
}>('toolbar/action')
