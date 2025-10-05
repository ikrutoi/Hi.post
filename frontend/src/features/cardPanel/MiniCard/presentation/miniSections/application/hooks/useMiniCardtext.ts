import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { createEditor, Descendant } from 'slate'
import { withReact } from 'slate-react'
import type { RootState } from '@app/state'

export const useMiniCardtext = (cardMiniSectionRef: HTMLDivElement | null) => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const selector = useSelector((state: RootState) => state.cardEdit.cardtext)
  const input = selector?.lineHeight ? selector : null

  const [value, setValue] = useState<Descendant[]>(
    input?.text ?? [{ type: 'paragraph', children: [{ text: '' }] }]
  )

  const [maxLines, setMaxLines] = useState(
    input?.miniCardtextStyle.maxLines ?? 1
  )
  const [lineHeight, setLineHeight] = useState(
    input?.miniCardtextStyle.lineHeight ?? 16
  )
  const [fontSize, setFontSize] = useState(
    input?.miniCardtextStyle.fontSize ?? 12
  )

  useEffect(() => {
    if (selector && JSON.stringify(selector.text) !== JSON.stringify(value)) {
      editor.children = selector.text
      setValue(selector.text)
      setMaxLines(selector.miniCardtextStyle.maxLines)
    }
  }, [selector, editor, value])

  useEffect(() => {
    if (cardMiniSectionRef) {
      const totalHeight = cardMiniSectionRef.clientHeight
      const computedStyle = window.getComputedStyle(cardMiniSectionRef)
      const paddingTop = parseFloat(computedStyle.paddingTop)
      const paddingBottom = parseFloat(computedStyle.paddingBottom)
      const contentHeight = totalHeight - paddingTop - paddingBottom

      const newLineHeight = contentHeight / maxLines
      setLineHeight(Number(newLineHeight.toFixed(2)))
      setFontSize(Number((newLineHeight / 1.35).toFixed(2)))
    }
  }, [maxLines, cardMiniSectionRef])

  const style = {
    fontSize: `${fontSize}px`,
    lineHeight: `${lineHeight}px`,
    color: input?.colorType,
    fontStyle: input?.fontStyle,
    fontWeight: input?.fontWeight,
    textAlign: input?.textAlign,
  } as React.CSSProperties

  return { editor, value, style }
}
