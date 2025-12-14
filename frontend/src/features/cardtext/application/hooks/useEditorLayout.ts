import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { EditorLayoutResult } from '../../domain/types'
import { RootState } from '@app/state'
import { selectCardtextLines } from '../../infrastructure/selectors'
import {
  DEFAULT_CARDTEXT_LINES,
  FONT_SIZE_COEFFICIENT,
} from '../../domain/types'
import { calculateEditorLayout } from '../helpers/calculateEditorLayout'

export const useEditorLayout = (
  editorRef: React.RefObject<HTMLDivElement | null>
): EditorLayoutResult => {
  const lines = useSelector((state: RootState) => selectCardtextLines(state))

  const [layout, setLayout] = useState<EditorLayoutResult>({
    lineHeight: 0,
    fontSize: 0,
  })

  useEffect(() => {
    const node = editorRef.current
    if (node && node.offsetHeight > 0) {
      const result = calculateEditorLayout({
        editorHeight: node.offsetHeight,
        lines: lines || DEFAULT_CARDTEXT_LINES,
        fontRatio: FONT_SIZE_COEFFICIENT,
      })
      setLayout(result)
    }
  }, [lines, editorRef])

  return layout
}
