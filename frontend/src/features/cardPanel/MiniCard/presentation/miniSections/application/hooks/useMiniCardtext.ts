import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import {
  DEFAULT_CARDTEXT_LINES,
  FONT_SIZE_COEFFICIENT_MINICARD,
  type TextAlign,
} from '@cardtext/domain/types'
import { calculateEditorLayout } from '@cardtext/application/helpers'
import { useSizeFacade } from '@layout/application/facades'
import {
  selectCardtextIsComplete,
} from '@cardtext/infrastructure/selectors'
import { createInitialCardtextContent } from '@cardtext/domain/editor/editor.types'
import type { RootState } from '@app/state'

export const useMiniCardtext = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const isComplete = useSelector(selectCardtextIsComplete)
  const appliedData = useSelector(
    (state: RootState) => state.cardtext.appliedData,
  )
  const fallback = createInitialCardtextContent()

  const displayValue = appliedData?.value ?? fallback.value
  const displayStyle = appliedData?.style ?? fallback.style
  const plainText = appliedData?.plainText ?? ''
  const cardtextLines = appliedData?.cardtextLines ?? fallback.cardtextLines

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

  const shouldShowMiniText = isComplete && (plainText?.trim?.() ?? '').length > 0

  return { editor, value: displayValue, style, shouldShowMiniText }
}
