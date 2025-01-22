import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Transforms, Editor, Range, Path, start } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
} from 'slate-react'
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

  const [editable, setEditable] = useState(null)
  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [editableWidth, setEditableWidth] = useState(null)
  useEffect(() => {
    if (!editableWidth) {
      setEditableWidth(editableRef.current.offsetWidth)
    }
  }, [editableWidth])
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [maxLines, setMaxLines] = useState(null)
  const [isMaxLines, setIsMaxLines] = useState(false)

  const [lastKey, setLastKey] = useState(null)

  //  !!!
  const handleSlateChange = (newValue) => {
    // console.log('last key from Change', lastKey)
    setValue(newValue)
  }

  const calcLinesInEditable = (linesCount) => {
    if (editorRef.current && editableRef.current) {
      const heightEditor = editorRef.current.offsetHeight
      const heightEditable = editableRef.current.offsetHeight
      const nodeElementLine = editorRef.current.querySelector(
        '[data-slate-node="element"]'
      )
      const heightLine = nodeElementLine.offsetHeight
      const maxNumberLinesFraction = heightEditor / heightLine
      const maxNumberLines = Math.floor(maxNumberLinesFraction)
      setMaxLines(maxNumberLines)
      if (linesCount >= maxNumberLines) {
        setIsMaxLines(true)
      }
    }
  }

  const handleKeyDown = (evt) => {
    setLastKey(evt.key)
    if (isMaxLines) {
      console.log('STOP!!')
      // evt.preventDefault()
    }
  }

  const handleKeyUp = (evt) => {
    const { selection } = editor
    if (selection) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)
      setFocusedElement({ node: node, start: start })
    }
  }

  useEffect(() => {
    calcLinesInEditable(linesCount)
  }, [linesCount])

  useEffect(() => {
    if (isMaxLines) {
      const [lastLineNode, lastLinePath] = Editor.last(editor, [])
      const domNodeLastLine = ReactEditor.toDOMNode(editor, lastLineNode)
      const widthLastLine = domNodeLastLine.offsetWidth
      console.log('widthLine', widthLastLine, 'widthEditor', editableWidth)
      // console.log('key', lastKey)
      if (widthLastLine >= editableWidth) {
        console.log('-------------')
      }
    }

    const currentNumberLines = editor.children.length
    if (linesCount !== currentNumberLines) {
      if (currentNumberLines === maxLines) {
        setIsMaxLines(true)
      } else {
        setIsMaxLines(false)
      }
      setLinesCount(editor.children.length)
    }
    if (focusedElement) {
      console.log(
        'FOCUS',
        focusedElement.start.path,
        '/',
        focusedElement.start.offset,
        '/length:',
        focusedElement.node.text.length
      )
    }
    if (
      focusedElement &&
      focusedElement.start.path[0] + 1 === editor.children.length &&
      focusedElement.start.offset === focusedElement.node.text.length
    ) {
      console.log('End of element on last line!')
    }
  }, [
    focusedElement,
    editor,
    linesCount,
    maxLines,
    value,
    isMaxLines,
    editableWidth,
  ])

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
            onBlur={() => setFocusedElement(null)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
