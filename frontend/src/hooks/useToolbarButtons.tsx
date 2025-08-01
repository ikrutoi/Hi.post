import { useMemo } from 'react'
import listBtnsEnvelope from '../configs/listBtnsEnvelope.json'
import { ToolbarBtnConfig } from '../types/toolbar'

export const useToolbarButtons = (): ToolbarBtnConfig[] => {
  return useMemo(() => listBtnsEnvelope, [])
}
