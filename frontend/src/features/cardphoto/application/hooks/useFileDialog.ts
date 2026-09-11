import { useCallback, useRef } from 'react'
import { useCardphotoUiFacade } from '../facades'

const PICKER_DISMISS_DELAY_MS = 400

export const useFileDialog = () => {
  const { actions } = useCardphotoUiFacade()
  const inputRef = useRef<HTMLInputElement>(null)

  const trackCancel = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    let settled = false

    const cleanup = () => {
      input.removeEventListener('cancel', onDismiss)
      window.removeEventListener('focus', onWindowFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.clearTimeout(focusTimer)
      window.clearTimeout(visibilityTimer)
    }

    const dismissWithoutSelection = () => {
      if (settled) return
      settled = true
      cleanup()
      if (!input.files?.length) {
        input.value = ''
        actions.cancelFileDialog()
      }
    }

    const scheduleDismissCheck = () => {
      window.clearTimeout(focusTimer)
      focusTimer = window.setTimeout(
        dismissWithoutSelection,
        PICKER_DISMISS_DELAY_MS,
      )
    }

    let focusTimer = 0
    let visibilityTimer = 0

    const onDismiss = () => dismissWithoutSelection()

    const onWindowFocus = () => scheduleDismissCheck()

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      window.clearTimeout(visibilityTimer)
      visibilityTimer = window.setTimeout(
        dismissWithoutSelection,
        PICKER_DISMISS_DELAY_MS,
      )
    }

    input.addEventListener('cancel', onDismiss)
    window.addEventListener('focus', onWindowFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }, [actions])

  return { inputRef, trackCancel }
}
