import { useLayoutInit } from './useLayoutInit'
import { useToolbarClickReset } from './useToolbarClickReset'

export const useLayoutEffects = ({
  formRef,
  formSize,
  colorToolbar,
  setColorToolbar,
}: {
  formRef: React.RefObject<HTMLDivElement | null>
  formSize?: { width: number; height: number }
  colorToolbar: boolean | null
  setColorToolbar: (v: boolean) => void
}) => {
  useLayoutInit()
  useToolbarClickReset(colorToolbar, setColorToolbar)
}
