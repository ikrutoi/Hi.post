import { useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact, useSlateStatic } from 'slate-react'
import './CardEditor.scss'

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
    { type: 'paragraph', children: [{ text: `${cardtext.text}` }] },
  ])

  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const markRef = useRef([])

  const getSizeEditorAndEditable = () => {
    if (editorRef.current && editableRef.current) {
      const editorHeight = editorRef.current.offsetHeight
      const editableHeight = editableRef.current.offsetHeight
      const lineHeight = document.querySelector(
        '[data-slate-node=element'
      ).offsetHeight
      const linesMax = Math.floor(editorHeight / lineHeight)
      const linesEditable = editableHeight / lineHeight
      return { linesEditable, linesMax }
    }
  }

  const getLastNestedElement = (element) => {
    while (element && element.lastElementChild) {
      element = element.lastElementChild
    }
    return element
  }

  const insertMark = (parentElement) => {
    if (parentElement) {
      const mark = document.createElement('span')
      mark.classList.add('cardtext-mark')
      parentElement.append(mark)
      markRef.current = mark
    }
  }

  const getLastElement = (e) => {
    while (e.children.length > 0) {
      if (e.children[e.children.length - 1] === markRef.current) {
        e.children[e.children.length - 1].remove()
      } else {
        e = e.children[e.children.length - 1]
      }
    }
    return e
  }

  const removeLastMark = () => {
    console.log('*')
    const markEl = document.querySelector('.cardtext-mark')
    if (markEl) {
      markEl.remove()
    }
  }

  const getEndOfText = () => {
    const lastElement = getLastElement(editableRef.current)
    insertMark(lastElement)
  }

  useEffect(() => {
    if (editableRef) {
      getEndOfText()
    }
  }, [value])

  const handleChangeSlate = (newValue) => {
    const linesEditable = getSizeEditorAndEditable().linesEditable
    const linesMax = getSizeEditorAndEditable().linesMax

    if (linesEditable >= linesMax) {
      // console.log('length', newValue[newValue.length - 1].children[0].text)
    }
    return setValue(newValue)
  }

  const handleKeyDown = (evt) => {
    const linesEditable = getSizeEditorAndEditable().linesEditable
    const linesMax = getSizeEditorAndEditable().linesMax
    if (evt.key === 'Enter') {
      removeLastMark()
    }
    if (evt.key === 'Enter' && linesEditable >= linesMax) {
      console.log('Enter stop')
      evt.preventDefault()
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
    }
  }

  return (
    <div className="cardeditor">
      <div className="editor" ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleChangeSlate}
          // onChange={(newValue) => setValue(newValue)}
        >
          <Editable
            ref={editableRef}
            onKeyDown={handleKeyDown}
            // renderElement={(props) => {
            //   if (props.element.type === 'mark') {
            //     return (
            //       <span {...props.attributes} ref={markRef}>
            //         {props.children}
            //       </span>
            //     )
            //   }
            //   return <p {...props.attributes}>{props.children}</p>
            // }}
            // {/* <TextEditor value={value} /> */}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
