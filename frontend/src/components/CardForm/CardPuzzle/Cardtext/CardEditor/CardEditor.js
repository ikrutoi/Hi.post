import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  createEditor,
  Transforms,
  Editor,
  Range,
  Path,
  start,
  last,
} from 'slate'
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
        color: '#007aac',
        font: '',
        fontsize: 2.2,
        fontstyle: 'italic',
        fontweight: 700,
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

  const [remSize, setRemSize] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
    const tempDiv = document.createElement('div')
    tempDiv.style.width = remSizeInPx
    tempDiv.style.visibility = 'hidden'
    document.body.appendChild(tempDiv)
    const computedRem = tempDiv.getBoundingClientRect().width
    setRemSize(computedRem)
    document.body.removeChild(tempDiv)
  }, [])

  const [editable, setEditable] = useState(null)
  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [editableWidth, setEditableWidth] = useState(null)
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [maxLines, setMaxLines] = useState(null)
  const [isMaxLines, setIsMaxLines] = useState(false)

  const [styleEditable, setStyleEditable] = useState({
    fontsize: null,
    fontstyle: null,
    fontweight: null,
    color: null,
    lineheight: null,
  })

  const markRef = useRef(null)
  const [markPath, setMarkPath] = useState(null)

  const handleSlateChange = (newValue) => {
    // console.log('last key from Change', lastKey)
    setValue(newValue)
  }

  // const calcLinesInEditable = useCallback(() => {
  //   // ;(linesCount) => {
  //   console.log('**')
  //   if (editorRef.current && editableRef.current) {
  //     // const heightEditor = editorRef.current.offsetHeight
  //     // const heightEditable = editableRef.current.offsetHeight
  //     // const baseSize = (heightEditor / 12).toFixed(1)
  //     // const baseSizeLineHeight = Math.floor(heightEditor / 12)
  //     // setLineHeightCurrent(baseSizeLineHeight)
  //     // const baseFontSize = baseSizeLineHeight / 1.33
  //     // setFontSizeCurrent(baseFontSize)
  //     // console.log('baseSize', baseSize, 'remSize', remSize)
  //     // const nodeElementLine = editorRef.current.querySelector(
  //     // '[data-slate-node="element"]'
  //     // )
  //     // const heightLine = nodeElementLine.offsetHeight
  //     // console.log('lineHeight', heightLine, 'fontsize', remSize * 2.2)
  //     // const maxNumberLinesFraction = heightEditor / heightLine
  //     // console.log('maxLinesFraction', maxNumberLinesFraction)
  //     // const maxNumberLines = Math.floor(maxNumberLinesFraction)
  //     // setMaxLines(maxNumberLines)
  //     // console.log('linesCount', linesCount, 'maxLines', maxLines)
  //     // if (linesCount >= maxLines) {
  //     //   const [lastLineNode, lastLinePath] = Editor.last(editor, [])
  //     //   const domNodeLastLine = ReactEditor.toDOMNode(editor, lastLineNode)
  //     //   const widthLastLine = domNodeLastLine.offsetWidth
  //     //   // console.log('widthLine', widthLastLine, 'widthEditor', editableWidth)
  //     //   // console.log('key', lastKey)
  //     //   if (widthLastLine >= editableWidth) {
  //     //     console.log('LIMIT!!!')
  //     //   }
  //     //   // setIsMaxLines(true)
  //     // }
  //     // }
  //   }
  // }, [editorRef, editableRef, linesCount, maxLines])

  const calcStyleAndLinesEditable = (condition) => {
    // console.log('calc:', condition)
    let lines
    switch (condition) {
      case 'startLines':
        lines = 12
        break
      case 'decreaseLines':
        lines = 12
        break
      case 'increaseLines':
        lines = maxLines + 1
        break

      default:
        break
    }

    const heightEditor = editorRef.current.offsetHeight
    const baseSizeLineHeight = Math.floor((heightEditor / lines) * 10) / 10
    const baseFontSize = Math.floor((baseSizeLineHeight / 1.33) * 10) / 10
    setStyleEditable((state) => {
      return {
        ...state,
        lineheight: baseSizeLineHeight,
        fontsize: baseFontSize,
      }
    })
    setMaxLines(lines)
    setEditableWidth(editableRef.current.offsetWidth)
  }

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef])

  const arrayCompare = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false
    }
    if (arr1 === null || arr2 === null) {
      return false
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }

  // const getDeepestChild = (element) => {
  //   if (element.dataset && element.dataset['slateNode'] === 'text') {
  //     return element
  //   }
  //   if (element.children.length === 0) {
  //     return null
  //   }
  //   return getDeepestChild(element.children[element.children.length - 1])
  // }

  const getDeepestChild = (element) => {
    if (element.children.length === 0) {
      return element
    }
    return getDeepestChild(element.children[element.children.length - 1])
  }

  useEffect(() => {
    console.log('heightEditor', editorRef.current.scrollHeight)
    console.log('heightEditableScroll', editableRef.current.scrollHeight)
    console.log('heightEditable1', editableRef.current.clientHeight)
    if (editorRef.current && markRef.current) {
      const markLineCurrent = Math.round(
        editableRef.current.scrollHeight /
          markRef.current.getBoundingClientRect().height
      )
      setLinesCount(markLineCurrent)
      if (markLineCurrent > maxLines && maxLines) {
        calcStyleAndLinesEditable('increaseLines')
      }
    }
    const creationMark = () => {
      const spanElement = document.createElement('span')
      spanElement.className = 'span-mark'
      spanElement.textContent = '*'
      spanElement.contentEditable = false
      markRef.current = spanElement
      return spanElement
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
        if (!markRef.current) {
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
    }
  }, [editor, value, markPath])

  const handleKeyDown = (evt) => {
    // console.log('key down0')
    // if (editorRef.current && markRef.current) {
    //   console.log('key down1')
    //   const markLineCurrent = Math.round(
    //     (markRef.current.getBoundingClientRect().top -
    //       editorRef.current.getBoundingClientRect().top +
    //       markRef.current.getBoundingClientRect().height) /
    //       markRef.current.getBoundingClientRect().height
    //   )
    //   console.log('markLines, maxLines', markLineCurrent, maxLines)
    //   if (markLineCurrent > maxLines && maxLines) {
    //     // console.log('key down outside true!')
    //     // setOutside(true)
    //     // calcStyleAndLinesEditable('increaseLines')
    //   }
    // }
    // console.log('outside', outside)
    // setLastKey(evt.key)
    // if (isMaxLines) {
    //   console.log('HandleKeyDown. Max Lines!')
    //   // evt.preventDefault()
    // }
  }

  const handleKeyUp = (evt) => {
    // console.log('keyUp')
    const { selection } = editor
    if (selection) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)
      setFocusedElement({ node: node, start: start })
    }
  }

  // useEffect(() => {
  //   const numberLines = editor.children.length
  //   setLinesCount(numberLines)
  //   if (maxLines && numberLines >= maxLines) {
  //     console.log('max lines')
  //     const [lastLineNode, lastLinePath] = Editor.last(editor, [])
  //     const domNodeLastLine = ReactEditor.toDOMNode(editor, lastLineNode)
  //     const widthLastLine = domNodeLastLine.offsetWidth
  //     console.log('lastLineWidth', widthLastLine, 0.9 * editableWidth)
  //     if (widthLastLine >= 0.9 * editableWidth) {
  //       console.log('limit!')
  //     }
  //   }
  // }, [editor, editor.children.length, maxLines, editableWidth])

  // useEffect(() => {
  //   const numberLines = editor.children.length
  //   if (numberLines !== linesCount) {
  //     setLinesCount(numberLines)
  //   }
  //   if (numberLines < maxLines && isMaxLines) {
  //     setIsMaxLines(false)
  //   }
  //   if (numberLines >= maxLines && maxLines) {
  //     setIsMaxLines(true)
  //   }
  // }, [editor.children.length, isMaxLines, linesCount, maxLines])

  // useEffect(() => {
  //   const [lastLineNode, lastLinePath] = Editor.last(editor, [])
  //   // const domLastNode = ReactEditor.toDOMNode(editor, lastLineNode)
  //   // if (domLastNode) {
  //   //   const spanElement = document.createElement('span')
  //   //   spanElement.textContent = '*'
  //   //   domLastNode.parentNode.insertBefore(spanElement, domLastNode.nextSibling)
  //   // }
  //   // console.log('lastNode', lastLineNode, lastLinePath)
  //   if (isMaxLines) {
  //     const domNodeLastLine = ReactEditor.toDOMNode(editor, lastLineNode)
  //     const widthLastLine = domNodeLastLine.offsetWidth
  //     console.log(
  //       'lastLineWidth',
  //       widthLastLine,
  //       Math.floor(0.95 * editableWidth)
  //     )
  //     if (widthLastLine >= 0.95 * editableWidth) {
  //       calcStyleAndLinesEditable('increaseLines')
  //       setIsMaxLines(false)
  //     }
  //   }
  // }, [isMaxLines, editableWidth, editor, value])

  // useEffect(() => {
  //   const currentNumberLines = editor.children.length
  //   if (linesCount !== currentNumberLines) {
  //     if (currentNumberLines === maxLines) {
  //       setIsMaxLines(true)
  //     } else {
  //       setIsMaxLines(false)
  //     }
  //     setLinesCount(editor.children.length)
  //     // calcLinesInEditable(editor.children.length)
  //   }
  // }, [linesCount, maxLines, editor.children.length])

  // useEffect(() => {
  //   if (isMaxLines) {
  //     console.log('max!!')
  //     const [lastLineNode, lastLinePath] = Editor.last(editor, [])
  //     const domNodeLastLine = ReactEditor.toDOMNode(editor, lastLineNode)
  //     const widthLastLine = domNodeLastLine.offsetWidth
  //     // console.log('widthLine', widthLastLine, 'widthEditor', editableWidth)
  //     // console.log('key', lastKey)
  //     if (widthLastLine >= editableWidth) {
  //       console.log('LIMIT!!!')
  //     }
  //   }
  // if (focusedElement) {
  //   console.log(
  //     'FOCUS',
  //     focusedElement.start.path,
  //     '/',
  //     focusedElement.start.offset,
  //     '/length:',
  //     focusedElement.node.text.length
  //   )
  // }
  // if (
  //   focusedElement &&
  //   focusedElement.start.path[0] + 1 === editor.children.length &&
  //   focusedElement.start.offset === focusedElement.node.text.length
  // ) {
  //   console.log('End of element on last line!')
  // }
  // }, [focusedElement, editor, value, isMaxLines, editableWidth])

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
            className="editable"
            style={
              styleEditable.fontsize && {
                fontSize: `${styleEditable.fontsize}px`,
                lineHeight: `${styleEditable.lineheight}px`,
                color: cardtext.color,
                fontStyle: cardtext.fontstyle,
                fontWeight: cardtext.fontweight,
              }
            }
            ref={editableRef}
            onBlur={() => setFocusedElement(null)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        </Slate>
      </div>
      <div className="editable-count">
        <span>{linesCount}</span>
        <span>/</span>
        <span>{maxLines && maxLines}</span>
      </div>
    </div>
  )
}

export default CardEditor
