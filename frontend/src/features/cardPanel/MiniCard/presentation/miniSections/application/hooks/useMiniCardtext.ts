import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import type { RootState } from '@app/state'
import {
  DEFAULT_CARDTEXT_LINES,
  FONT_SIZE_COEFFICIENT_MINICARD,
} from '@cardtext/domain/types'
import { calculateEditorLayout } from '@cardtext/application/helpers'
import { useSizeFacade } from '@layout/application/facades'

export const useMiniCardtext = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const { value, cardtextLines, applied, appliedData, style: cardtextStyle } =
    useSelector((state: RootState) => state.cardtext)
  const displayValue = applied != null && appliedData?.value ? appliedData.value : value
  const displayStyle = applied != null && appliedData?.style ? appliedData.style : cardtextStyle

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
          textAlign: (displayStyle?.align ?? 'left') as const,
          color: colorVarDisplay,
        }
      })()
    : {
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: (displayStyle?.align ?? 'left') as const,
        color: colorVarDisplay,
      }

  // Показываем текст в мини-версии только если есть применённый вариант.
  const hasApplied = applied != null

  return { editor, value: displayValue, style, hasApplied }
}
