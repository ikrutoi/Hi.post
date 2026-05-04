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
  selectCardtextValue,
  selectCardtextPlainText,
  selectCardtextStyle,
  selectCardtextLines,
} from '@cardtext/infrastructure/selectors'
import {
  cardtextHasRenderableContent,
  createInitialCardtextContent,
  type CardtextContent,
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
  const value = useSelector(selectCardtextValue)
  const plainText = useSelector(selectCardtextPlainText)
  const displayStyle = useSelector(selectCardtextStyle)
  const cardtextLines = useSelector(selectCardtextLines)

  const { sizeMiniCard } = useSizeFacade()

  const style = buildMiniCardtextMiniSurfaceStyle(
    displayStyle,
    cardtextLines,
    sizeMiniCard?.height,
  )

  /** Та же ветка, что и в фабрике/левом пироге (`displayCardtextBranch` внутри селекторов). */
  const sessionPreview = useMemo(
    (): CardtextContent => ({
      ...createInitialCardtextContent(),
      value,
      plainText,
      style: displayStyle,
      cardtextLines,
    }),
    [value, plainText, displayStyle, cardtextLines],
  )

  const shouldShowMiniText = cardtextHasRenderableContent(sessionPreview)

  return { editor, value, style, shouldShowMiniText }
}
