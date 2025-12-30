import { useRef } from 'react'
import { useCardphotoUiFacade } from '../facades'

export const useFileDialog = () => {
  const { actions } = useCardphotoUiFacade()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    if (!inputRef.current?.files?.length) {
      actions.cancelFileDialog()
    }
  }

  return { inputRef, handleBlur }
}
