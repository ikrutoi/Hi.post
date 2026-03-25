import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import {
  DEFAULT_CARDTEXT_LINES,
  FONT_SIZE_COEFFICIENT_MINICARD,
} from '@cardtext/domain/types'
import {
  selectCardtextValue,
  selectCardtextLines,
} from '@cardtext/infrastructure/selectors'
import { calculateEditorLayout } from '@cardtext/application/helpers'
import { useLayoutFacade } from '@layout/application/facades'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'

export const useMiniCardtextScale = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const value = useSelector(selectCardtextValue)
  const cardtextLines = useSelector(selectCardtextLines)

  const { size } = useLayoutFacade()
  const { sizeCard, sizeMiniCard } = size

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

  const scale = CARD_SCALE_CONFIG.scaleMiniCard

  return { editor, value, style, sizeCard, scale }
}
