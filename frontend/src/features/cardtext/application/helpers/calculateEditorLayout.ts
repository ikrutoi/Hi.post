import type {
  EditorLayoutOptions,
  EditorLayoutResult,
} from '../../domain/types'
import { CARDTEXT_FONT_RATIO } from '@shared/config/constants'

export function calculateEditorLayout(
  options: EditorLayoutOptions
): EditorLayoutResult {
  const { lines, editorHeight, fontRatio } = options

  const lineHeight = lines > 0 ? editorHeight / lines : editorHeight
  const fontSize = lineHeight * fontRatio

  return {
    lineHeight: Math.floor(lineHeight),
    fontSize: Math.floor(fontSize),
  }
}
