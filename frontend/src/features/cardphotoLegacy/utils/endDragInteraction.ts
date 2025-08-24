import { performDragInteraction } from './performDragInteraction'

export const endDragInteraction = (
  setIsDragging: (value: boolean) => void
): void => {
  setIsDragging(false)

  window.removeEventListener(
    'mousemove',
    performDragInteraction as EventListener
  )
  window.removeEventListener('mouseup', () => endDragInteraction(setIsDragging))
  window.removeEventListener('mouseleave', () =>
    endDragInteraction(setIsDragging)
  )
}
