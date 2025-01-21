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
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [heightLine, setHeightLine] = useState(null)

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

    // const linesCountNow = newValue.filter(
    //   (node) => node.type === 'paragraph'
    // ).length
    // if (linesCount !== linesCountNow) {
    //   setLinesCount(linesCountNow)
    // }
  }

  // const handleSelectionChange = () => {
  //   const { selection } = editor
  //   if (selection) {
  //     const [start] = Range.edges(selection)
  //     const [node] = Editor.node(editor, start)
  //     setFocusedElement(node)
  //     // console.log('Фокус на элементе:', node)
  //     console.log(
  //       'HandleSelectionChange. Focus path / focus:',
  //       start.path,
  //       '/',
  //       start.offset
  //     )
  //     // console.log('Focus node.length:', node.text.length)
  //   } else {
  //     setFocusedElement(null)
  //     console.log('HandleSelectionChange. Элемент потерял фокус')
  //   }
  // }

  // const updateSelectionEditable = () => {
  //   const updateSelection = () => {
  //     const { selection } = editor
  //     if (selection) {
  //       const [start] = Range.edges(selection)
  //       const [node] = Editor.node(editor, start)
  //       console.log('node', node)
  //       // setFocusedElement(node)
  //       console.log(
  //         'UseEffect. Focus path / focus:',
  //         start.path,
  //         '/',
  //         start.offset
  //       )
  //     }
  //   }
  //   document.addEventListener('selectionchange', updateSelection)
  //   return () => {
  //     document.removeEventListener('selectionchange', updateSelection)
  //   }
  // }

  // useEffect(() => {
  //   // const updateSelection = () => {
  //   const { selection } = editor
  //   if (selection) {
  //     const [start] = Range.edges(selection)
  //     const [node] = Editor.node(editor, start)
  //     setFocusedElement({ node: node, start: start })
  //     console.log('focus', start.offset)
  //   }
  //   // }
  //   // document.addEventListener('selectionchange', updateSelection)
  //   // return () => {
  //   //   document.removeEventListener('selectionchange', updateSelection)
  //   // }
  // }, [editor])

  const calcLinesInEditable = () => {
    if (editorRef.current && editableRef.current) {
      const heightEditor = editorRef.current.offsetHeight
      const heightEditable = editableRef.current.offsetHeight
      const nodeElementLine = editorRef.current.querySelector(
        '[data-slate-node="element"]'
      )
      const heightLine = nodeElementLine.offsetHeight
      const linesMax = heightEditor / heightLine
      const heightLineToFixed = linesMax.toFixed(1)
      setHeightLine(heightEditable)
      return { heightLineToFixed }
    }
  }

  const handleKeyUp = (evt) => {
    // const linesEditable = getSizeEditorAndEditable().linesEditable
    // const linesMax = getSizeEditorAndEditable().linesMax
    if (evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
      const { selection } = editor
      if (selection) {
        const [start] = Range.edges(selection)
        const [node] = Editor.node(editor, start)
        setFocusedElement({ node: node, start: start })
      }
    }

    if (evt.key === 'Enter') {
      console.log('key press Enter')
      // const marks = markElementsWithId(editor, markId.current)
      const pathMark = findPathById(editor, markId.current)
      // const newPathMark = pathMark.map((el, i) => {
      //   if (i === 0) {
      //     return (el = el + 1)
      //   }
      //   return el
      // })
      // removeDuplicateMark(editor, marks)
      // for (let i = 0; i < marks.length; i++) {
      // console.log('REMOVE!!')
      // const { path } = marks[i]
      Transforms.removeNodes(editor, { at: pathMark })
      // insertMarkInLastLine()
      // console.log('MARKS:', marks[i])
      // }
      // for (let i = 0; i < marks.length; i++) {
      //   // console.log('REMOVE!!')
      //   const { path } = marks[i]
      //   Transforms.removeNodes(editor, { at: path })
      //   // console.log('MARKS:', marks[i])
      // }

      // evt.preventDefault()
      // Transforms.insertNodes(editor, { text: '@' }, { at: [1, 0] })
      // const [start] = Range.edges(selection)
      // const path = findPathById(editor, markId.current)
      // if (path && Path.equals(start.path, path)) {
      //   // Transforms.insertNodes(editor, { text: '<>' }, { at: path })
      //   // Transforms.insertNodes(editor, { text: '\uFEFF' }, { at: path })
      // }
      // }
    }
    // if (evt.key === 'Enter' && linesEditable >= linesMax) {
    // console.log('Enter stop')
    // evt.preventDefault()
    // if (evt.key === 'Enter' && linesEditable <= linesMax) {
    //   const [match] = Editor.nodes(editor, {
    //     match: (n) => Editor.isBlock(editor, n),
    //   })
    //   if (match) {
    //     Transforms.insertNodes(editor, {
    //       type: 'paragraph',
    //       children: [{ text: '' }],
    //     })
    //   }
    // }
  }

  //  !!!
  const markId = useRef(uuidv4())

  const insertMarkInLastLine = useCallback(() => {
    const { selection } = editor
    if (selection) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)
      setFocusedElement({ node: node, start: start })
      // setOffset(start.offset)
      // console.log('INSERT MARK. path / focus:', start.path, '/', start.offset)
      // console.log('Focus node:', node)

      // const mark = getMarkElementsWithId(editor, markId.current)
      // console.log('mark', mark[0].path)
    }

    const lastLinePath = [editor.children.length - 1]
    const [lastLine] = Editor.node(editor, lastLinePath)
    const endOfLastLinePath = [...lastLinePath, lastLine.children.length]
    const existingMark = lastLine.children.find(
      (child) => child.id === markId.current && child.text === '*'
    )
    const marks = getMarkElementsWithId(editor, markId.current)
    if (!existingMark) {
      // console.log('insert Mark')
      // Transforms.insertNodes(
      //   editor,
      //   {
      //     type: 'paragraph',
      //     children: [{ text: '\uFEFF' }],
      //   },

      //   { at: endOfLastLinePath }
      // )
      Transforms.insertNodes(
        editor,
        {
          type: 'mark',
          children: [{ text: '*', id: markId.current }],
        },

        { at: endOfLastLinePath }
      )
    }
    if (marks.length > 1) {
      removeDuplicateMark(editor, marks)
    }

    // const pathMark = findPathById(editor, markId.current)
    // Transforms.select(editor, {
    //   anchor: Editor.before(editor, pathMark),
    //   focus: Editor.before(editor, pathMark),
    // })
  }, [editor])

  const findPathById = (editor, id) => {
    for (const [node, path] of Editor.nodes(editor, {
      at: [],
      match: (n) => n.id === markId.current,
    })) {
      return path
    }
    return null
  }

  const getMarkElementsWithId = (editor, id) => {
    const marks = []
    for (const [node, path] of Editor.nodes(editor, {
      at: [],
      match: (n) => n.id === id,
    })) {
      marks.push({ node, path })
    }
    return marks
  }

  const removeDuplicateMark = (editor, marks) => {
    for (let i = 0; i < marks.length; i++) {
      // console.log('REMOVE!!')
      const { path } = marks[i]
      Transforms.removeNodes(editor, { at: path })
      // console.log('MARKS:', marks[i])
    }
    // marks.splice(0, marks.length)
  }

  useEffect(() => {
    calcLinesInEditable()
  }, [linesCount])

  useEffect(() => {
    insertMarkInLastLine()
  }, [editor, insertMarkInLastLine, value])

  useEffect(() => {
    const nodesElementValue = Editor.nodes(editor, {
      at: [],
      match: (n) => n['data-slate-node'] === 'element',
    })
    console.log('nodeSlate', nodesElementValue)
    const nodesArrayElementValue = Array.from(nodesElementValue)
    console.log('nodeSlate2', nodesArrayElementValue)
    console.log('lines//', editor.children.length)
    // if (
    //   editorRef.current &&
    //   editableRef.current &&
    //   linesCount !== editableRef.current.children.length
    // ) {
    //   setLinesCount(editorRef.current.children.length)
    // }
    if (focusedElement) {
      console.log(
        'FOCUS',
        focusedElement.start.path,
        '/',
        focusedElement.start.offset,
        '/length:',
        focusedElement.node.text.length
      )
      console.log('lines**:', linesCount)
    }
    if (
      focusedElement &&
      focusedElement.start.path[0] + 1 === editor.children.length &&
      focusedElement.start.offset === focusedElement.node.text.length
    ) {
      console.log('End of element on last line!')
    }
  }, [focusedElement, editor, linesCount])

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
            onKeyUp={handleKeyUp}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
