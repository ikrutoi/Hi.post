import { useState, useEffect } from 'react'
import { calculateEditorLayout } from '../helpers'
import { CARDTEXT_FONT_RATIO } from '@shared/config/constants'
import {
  DEFAULT_CARDTEXT_LINES,
  DEFAULT_FONT_SIZE,
  DEFAULT_LINE_HEIGHT,
} from '../../domain/types'
import type { EditorLayoutResult } from '../../domain/types'

export const useEditorLayout = (
  editorRef: React.RefObject<HTMLDivElement | null>,
  lines: number = DEFAULT_CARDTEXT_LINES
): EditorLayoutResult => {
  const [layout, setLayout] = useState<EditorLayoutResult>({
    lineHeight: DEFAULT_LINE_HEIGHT,
    fontSize: DEFAULT_FONT_SIZE,
  })

  useEffect(() => {
    if (editorRef.current) {
      const height = editorRef.current.offsetHeight
      const lineHeight = height / lines
      const fontSize = lineHeight * CARDTEXT_FONT_RATIO
      setLayout({ lineHeight, fontSize })
    }
  }, [editorRef, lines])

  return layout
}
