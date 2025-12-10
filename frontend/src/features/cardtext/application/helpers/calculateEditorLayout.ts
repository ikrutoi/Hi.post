import type {
  EditorLayoutOptions,
  EditorLayoutResult,
} from '../../domain/types'

export function calculateEditorLayout(
  options: EditorLayoutOptions
): EditorLayoutResult {
  const { lines, editorHeight } = options

  const lineHeight = editorHeight / lines

  const fontSize = lineHeight * 0.75

  return {
    lineHeight: Math.floor(lineHeight),
    fontSize: Math.floor(fontSize),
  }
}
