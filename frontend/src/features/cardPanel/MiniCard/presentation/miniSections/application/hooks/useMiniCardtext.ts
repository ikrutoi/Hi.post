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

  const { value, cardtextLines } = useSelector(
    (state: RootState) => state.cardtext,
  )

  const { sizeMiniCard } = useSizeFacade()

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
          textAlign: 'left' as const,
        }
      })()
    : {
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'left' as const,
      }

  return { editor, value, style }
}
