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
import { selectCardtextDisplayForMiniStrip } from '@cardtext/infrastructure/selectors'
import {
  cardtextHasRenderableContent,
  type CardtextStyle,
} from '@cardtext/domain/editor/editor.types'
import type { CSSProperties } from 'react'

export function buildMiniCardtextMiniSurfaceStyle(
  displayStyle: CardtextStyle,
  cardtextLines: number,
  editorHeightPx: number | undefined,
): CSSProperties {
  const colorKeyDisplay = displayStyle?.color ?? 'deepBlack'
  const colorVarDisplay = `var(--color-font-${colorKeyDisplay})`
  if (editorHeightPx != null && editorHeightPx > 0) {
    const result = calculateEditorLayout({
      editorHeight: editorHeightPx,
      lines: cardtextLines || DEFAULT_CARDTEXT_LINES,
      fontRatio: FONT_SIZE_COEFFICIENT_MINICARD,
    })
    return {
      fontSize: `${result.fontSize}px`,
      lineHeight: `${result.lineHeight}px`,
      textAlign: (displayStyle?.align ?? 'left') as TextAlign,
      color: colorVarDisplay,
    }
  }
  return {
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: (displayStyle?.align ?? 'left') as TextAlign,
    color: colorVarDisplay,
  }
}

/** `editorMountKey` — отдельный экземпляр Slate при смене зеркала/строки списка. */
export const useMiniCardtext = (editorMountKey = 'default') => {
  const editor = useMemo(() => withReact(createEditor()), [editorMountKey])
  const miniDisplay = useSelector(selectCardtextDisplayForMiniStrip)
  const value = miniDisplay.value
  const displayStyle = miniDisplay.style as CardtextStyle
  const cardtextLines = miniDisplay.cardtextLines

  const { sizeMiniCard } = useSizeFacade()

  const style = buildMiniCardtextMiniSurfaceStyle(
    displayStyle,
    cardtextLines,
    sizeMiniCard?.height,
  )

  /** До Apply шаблон из списка не попадает в мини — см. `selectCardtextDisplayForMiniStrip`. */
  const shouldShowMiniText = cardtextHasRenderableContent(miniDisplay)

  return { editor, value, style, shouldShowMiniText }
}
