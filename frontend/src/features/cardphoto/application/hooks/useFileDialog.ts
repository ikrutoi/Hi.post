import { useRef } from 'react'
import { useCardphotoUiFacade } from '../facades'

export const useFileDialog = () => {
  const { actions } = useCardphotoUiFacade()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleBlur = () => {
    console.log('++')
    if (!inputRef.current?.files?.length) {
      console.log('+++')
      actions.cancelFileDialog()
    }
  }

  return { inputRef, handleBlur }
}
