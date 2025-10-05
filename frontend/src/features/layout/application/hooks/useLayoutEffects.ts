import { useLayoutInit } from './useLayoutInit'
import { useLayoutResize } from './useLayoutResize'
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
  useLayoutResize(formRef, formSize)
  useToolbarClickReset(colorToolbar, setColorToolbar)
}
