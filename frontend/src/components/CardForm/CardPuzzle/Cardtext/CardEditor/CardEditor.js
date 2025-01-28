import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Editor, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import './CardEditor.scss'
import Toolbar from '../Toolbar/Toolbar'
import { addCardtext } from '../../../../../redux/cardEdit/actionCreators'

const CardEditor = ({ toolbarColor, setToolbarColorActive }) => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector.text ? selector : null
  const [cardtext, setCardtext] = useState(inputCardtext)

  useEffect(() => {
    setCardtext(selector)
  }, [selector])

  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(cardtext.text)

  const dispatch = useDispatch()

  // const [remSize, setRemSize] = useState(0)

  // useEffect(() => {
  //   const root = document.documentElement
  //   const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
  //   const tempDiv = document.createElement('div')
  //   tempDiv.style.width = remSizeInPx
  //   tempDiv.style.visibility = 'hidden'
  //   document.body.appendChild(tempDiv)
  //   const computedRem = tempDiv.getBoundingClientRect().width
  //   setRemSize(computedRem)
  //   document.body.removeChild(tempDiv)
  // }, [])

  const [editable, setEditable] = useState(null)
  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [editableWidth, setEditableWidth] = useState(null)
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [maxLines, setMaxLines] = useState(null)

  const markRef = useRef(null)
  const [markPath, setMarkPath] = useState(null)

  const handleSlateChange = (newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef.current])

  // useEffect(() => {
  // }, [value])
  // console.log('value', value)

  const calcStyleAndLinesEditable = (condition) => {
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
    dispatch(
      addCardtext({
        fontSize: baseFontSize,
        lineHeight: baseSizeLineHeight,
      })
    )
    setMaxLines(lines)
    setEditableWidth(editableRef.current.offsetWidth)
  }

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

  const getDeepestChild = (element) => {
    if (element.children.length === 0) {
      return element
    }
    return getDeepestChild(element.children[element.children.length - 1])
  }

  useEffect(() => {
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
    const { selection } = editor
    if (selection) {
      const [start] = Range.edges(selection)
      const [node] = Editor.node(editor, start)
      setFocusedElement({ node: node, start: start })
    }
  }

  const btnRefs = useRef([])

  const handleClickToolbar = (evt, i) => {
    // console.log('btnRef', btnRefs.current[i])
    const searchParentBtn = (el) => {
      if (el.classList.contains('toolbar-btn')) {
        return el
      } else if (el.parentElement) {
        return searchParentBtn(el.parentElement)
      }
      return null
    }

    const btn = searchParentBtn(evt.target)
    const btnTooltip = btn.dataset.tooltip

    if (btnTooltip === 'color') {
      setToolbarColorActive(true)
    }
    if (
      btnTooltip === 'left' ||
      btnTooltip === 'center' ||
      btnTooltip === 'right' ||
      btnTooltip === 'justify'
    ) {
      dispatch(addCardtext({ textAlign: btn.dataset.tooltip }))
    }
  }

  const handleClickColor = (evt) => {
    dispatch(
      addCardtext({
        colorName: evt.target.dataset.colorName,
        colorType: evt.target.dataset.colorType,
      })
    )
  }

  useEffect(() => {
    dispatch(addCardtext({ text: value }))
    // console.log('*', value)
    // value.forEach((el) => {
    //   console.log('**', el)
    //   // console.log('value:', el.children[0].text)
    // })
  }, [value, dispatch])

  useEffect(() => {
    console.log('cardtext:', cardtext.text)
  }, [cardtext.text])

  return (
    <div className="cardeditor">
      <div className="editor" ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleSlateChange}
        >
          <Toolbar
            editor={editor}
            btnRefs={btnRefs}
            handleClickToolbar={handleClickToolbar}
            cardtext={cardtext}
            toolbarColor={toolbarColor}
            toolbarIconColor={cardtext.colorType}
            handleClickColor={handleClickColor}
          />
          <Editable
            className="editable"
            style={
              cardtext && {
                fontSize: `${cardtext.fontSize}px`,
                lineHeight: `${cardtext.lineHeight}px`,
                color: cardtext.colorType,
                fontStyle: cardtext.fontStyle,
                fontWeight: cardtext.fontWeight,
                textAlign: cardtext.textAlign,
              }
            }
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
