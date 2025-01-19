import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Transforms, Editor, marks } from 'slate'
import { Slate, Editable, withReact, useSlateStatic } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import './CardEditor.scss'
import Toolbar from '../Toolbar/Toolbar'

const CardEditor = () => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector.text
    ? selector
    : {
        text: 'hello...',
        maxchars: 300,
        color: 'blue1',
        fontsize: 3,
        lines: 1,
        focus: false,
        focusrow: 1,
      }
  const [cardtext, setCardtext] = useState(inputCardtext)

  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(() => [
    {
      type: 'paragraph',
      children: [{ text: `${cardtext.text}` }],
    },
  ])

  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [linesCount, setLinesCount] = useState(1)

  // const getSizeEditorAndEditable = () => {
  //   if (editorRef.current && editableRef.current) {
  //     const editorHeight = editorRef.current.offsetHeight
  //     const editableHeight = editableRef.current.offsetHeight
  //     const lineHeight = document.querySelector(
  //       '[data-slate-node=element'
  //     ).offsetHeight
  //     const linesMax = Math.floor(editorHeight / lineHeight)
  //     const linesEditable = editableHeight / lineHeight
  //     return { linesEditable, linesMax }
  //   }
  // }

  // !!!
  // const getLastElementInLine = () => {
  //   const elemEditable = document.querySelector(`[data-slate-node="value"]`)
  //   if (elemEditable) {
  //     const lastLine = elemEditable.lastElementChild
  //     const findDeepestElement = (el) => {
  //       let deepestElement = el
  //       let deepestLevel = 0
  //       const traverse = (currentElement, currentLevel) => {
  //         if (currentLevel > deepestLevel) {
  //           deepestLevel = currentLevel
  //           deepestElement = currentElement
  //         }
  //         Array.from(currentElement.children).forEach((child) => {
  //           traverse(child, currentLevel + 1)
  //         })
  //       }
  //       traverse(el, 0)
  //       return deepestElement
  //     }
  //     const deepestElement = findDeepestElement(lastLine)
  //     console.log('The most recent nested element:', deepestElement)
  //     return deepestElement
  //   }
  // }
  // !!!

  //  !!!
  const handleSlateChange = (newValue) => {
    setValue(newValue)
    const linesCountNow = newValue.filter(
      (node) => node.type === 'paragraph'
    ).length
    if (linesCount !== linesCountNow) {
      setLinesCount(linesCountNow)
    }
  }
  // !!!

  // const handleKeyDown = (evt) => {
  //   const linesEditable = getSizeEditorAndEditable().linesEditable
  //   const linesMax = getSizeEditorAndEditable().linesMax
  //   if (evt.key === 'Enter') {
  //     // removeLastMark()
  //   }
  //   if (evt.key === 'Enter' && linesEditable >= linesMax) {
  //     console.log('Enter stop')
  //     evt.preventDefault()
  //     // if (evt.key === 'Enter' && linesEditable <= linesMax) {
  //     //   const [match] = Editor.nodes(editor, {
  //     //     match: (n) => Editor.isBlock(editor, n),
  //     //   })
  //     //   if (match) {
  //     //     Transforms.insertNodes(editor, {
  //     //       type: 'paragraph',
  //     //       children: [{ text: '' }],
  //     //     })
  //     //   }
  //   }
  // }

  //  !!!
  const markId = useRef(uuidv4())

  const insertMarkInLastLine = useCallback(() => {
    const lastLinePath = [editor.children.length - 1]
    const [lastLine] = Editor.node(editor, lastLinePath)
    const endOfLastLinePath = [...lastLinePath, lastLine.children.length]
    const existingMark = lastLine.children.find(
      (child) => child.id === markId.current
    )
    if (!existingMark) {
      Transforms.insertNodes(
        editor,
        { type: 'mark', children: [{ text: '\uFEFF', id: markId.current }] },
        { at: endOfLastLinePath }
      )
    }
  }, [editor])

  useEffect(() => {
    console.log('*')
    insertMarkInLastLine()
  }, [editor, insertMarkInLastLine, value])

  return (
    <div className="cardeditor">
      <div className="editor" ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleSlateChange}
        >
          <Toolbar editor={editor} />
          <Editable
            ref={editableRef}
            // onKeyDown={handleKeyDown}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
