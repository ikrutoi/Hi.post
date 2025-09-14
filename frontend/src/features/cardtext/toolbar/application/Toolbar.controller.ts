import { useCallback } from 'react'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@features/cardtext/utils'
import { useToolbar } from '@features/cardtext/toolbar/infrastructure/useToolbar'

export const useToolbarController = ({
  btnsCardtext,
  setBtnIconRefs,
}: {
  btnsCardtext: Record<string, any>
  setBtnIconRefs: (key: string) => (el: HTMLButtonElement | null) => void
}) => {
  const { updateToolbarState } = useToolbar()

  const handleClickBtn = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>, btn: string) => {
      updateToolbarState({ [btn]: true })
    },
    [updateToolbarState]
  )

  const handleClickBtnMain = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) => {
      const btn = evt.currentTarget.dataset.tooltip
      if (btn) updateToolbarState({ [btn]: true })
    },
    [updateToolbarState]
  )

  const handleMouseEnter = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) =>
      handleMouseEnterBtn(evt, btnsCardtext),
    [btnsCardtext]
  )

  const handleMouseLeave = useCallback(
    (evt: React.MouseEvent<HTMLButtonElement>) =>
      handleMouseLeaveBtn(evt, btnsCardtext),
    [btnsCardtext]
  )

  return {
    handleClickBtn,
    handleClickBtnMain,
    handleMouseEnter,
    handleMouseLeave,
    setBtnIconRefs,
  }
}
