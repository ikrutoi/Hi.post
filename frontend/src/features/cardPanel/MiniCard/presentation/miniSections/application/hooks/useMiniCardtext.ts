import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import type { RootState } from '@app/state'
import {
  DEFAULT_CARDTEXT_LINES,
  FONT_SIZE_COEFFICIENT_MINICARD,
  type TextAlign,
} from '@cardtext/domain/types'
import { calculateEditorLayout } from '@cardtext/application/helpers'
import { useSizeFacade } from '@layout/application/facades'
import {
  selectCardtextValue,
  selectCardtextLines,
  selectCardtextStatus,
  selectCardtextPlainText,
  selectCardtextStyle,
} from '@cardtext/infrastructure/selectors'

export const useMiniCardtext = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const value = useSelector(selectCardtextValue)
  const cardtextLines = useSelector(selectCardtextLines)
  const status = useSelector(selectCardtextStatus)
  const plainText = useSelector(selectCardtextPlainText)
  const cardtextStyle = useSelector(selectCardtextStyle)

  const displayValue = value
  const displayStyle = cardtextStyle

  const { sizeMiniCard } = useSizeFacade()

  const colorKeyDisplay = displayStyle?.color ?? 'deepBlack'
  const colorVarDisplay = `var(--color-font-${colorKeyDisplay})`
  const style = sizeMiniCard?.height
    ? (() => {
        const result = calculateEditorLayout({
          editorHeight: sizeMiniCard.height,
          lines: cardtextLines || DEFAULT_CARDTEXT_LINES,
          fontRatio: FONT_SIZE_COEFFICIENT_MINICARD,
        })
        return {
          fontSize: `${result.fontSize}px`,
          lineHeight: `${result.lineHeight}px`,
          textAlign: (displayStyle?.align ?? 'left') as TextAlign,
          color: colorVarDisplay,
        }
      })()
    : {
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: (displayStyle?.align ?? 'left') as TextAlign,
        color: colorVarDisplay,
      }

  const shouldShowMiniText =
    status === 'processed' && (plainText?.trim?.() ?? '').length > 0

  return { editor, value: displayValue, style, shouldShowMiniText }
}
