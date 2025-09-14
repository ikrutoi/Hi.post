import { useEffect } from 'react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'

export const useEditorMarkers = ({
  editor,
  editorRef,
  editableRef,
  markRef,
  markPath,
  setMarkPath,
  calcStyleAndLinesEditable,
}: {
  editor: Editor
  editorRef: React.RefObject<HTMLDivElement>
  editableRef: React.RefObject<HTMLDivElement>
  markRef: React.MutableRefObject<HTMLElement | null>
  markPath: any
  setMarkPath: (path: any) => void
  calcStyleAndLinesEditable: (mode: 'increaseLines' | 'startLines') => void
}) => {
  useEffect(() => {
    if (
      editorRef.current &&
      markRef.current &&
      markRef.current.getBoundingClientRect().height !== 0
    ) {
      const markLineCurrent = Math.round(
        (editableRef.current?.scrollHeight ?? 0) /
          markRef.current.getBoundingClientRect().height
      )

      if (markLineCurrent > 0) {
        calcStyleAndLinesEditable('increaseLines')
      }
    }

    const creationMark = (): HTMLSpanElement => {
      const spanElement = document.createElement('span')
      spanElement.className = 'editor__span-mark'
      spanElement.textContent = ''
      spanElement.contentEditable = 'false'
      markRef.current = spanElement
      return spanElement
    }

    const getDeepestChild = (element: any): any => {
      if (!element.children?.length) return element
      return getDeepestChild(element.children[element.children.length - 1])
    }

    if (editorRef.current) {
      const [lastLineNode, lastLinePath] = Editor.last(editor, [])

      if (markRef.current && !document.contains(markRef.current)) {
        markRef.current.remove()
        markRef.current = null
        const domLastNode = ReactEditor.toDOMNode(editor, lastLineNode)
        const deepestChild = getDeepestChild(domLastNode)
        const spanElement = creationMark()
        deepestChild.insertAdjacentElement('afterEnd', spanElement)
      }

      if (!markPath || !arrayCompare(markPath, lastLinePath)) {
        setMarkPath(lastLinePath)
        if (markRef.current) {
          markRef.current.remove()
          markRef.current = null
        }

        const domLastNode = ReactEditor.toDOMNode(editor, lastLineNode)
        const deepestChild = getDeepestChild(domLastNode)

        if (deepestChild && deepestChild.tagName !== 'BR') {
          const spanElement = creationMark()
          deepestChild.insertAdjacentElement('afterEnd', spanElement)
        }

        if (deepestChild && deepestChild.tagName === 'BR') {
          const spanElement = creationMark()
          deepestChild.insertAdjacentElement('beforeBegin', spanElement)
        }
      }
    }
  }, [editor, markPath, editableRef])
}

const arrayCompare = (arr1: any[], arr2: any[]): boolean => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false
  return arr1.every((val, i) => val === arr2[i])
}
