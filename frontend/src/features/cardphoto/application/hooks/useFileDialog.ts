import { useRef } from 'react'
import { useCardphotoUiFacade } from '../facades'

export const useFileDialog = () => {
  const { actions } = useCardphotoUiFacade()
  const inputRef = useRef<HTMLInputElement>(null)

  const trackCancel = () => {
    const onWindowFocus = () => {
      setTimeout(() => {
        if (!inputRef.current?.files?.length) {
          actions.cancelFileDialog()
        }
        window.removeEventListener('focus', onWindowFocus)
      }, 300)
    }

    window.addEventListener('focus', onWindowFocus)
  }

  return { inputRef, trackCancel }
}
