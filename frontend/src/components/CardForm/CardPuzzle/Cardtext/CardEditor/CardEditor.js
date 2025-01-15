import { useSelector } from 'react-redux'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import './CardEditor.scss'
// import TextEditor from './TextEditor/TextEditor'

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

  const handleKeyDown = (evt) => {
    const editorHeight = editorRef.current.offsetHeight
    const editableHeight = editableRef.current.offsetHeight

    const lineHeight = document.querySelector(
      '[data-slate-node=element'
    ).offsetHeight

    const linesMax = Math.floor(editorHeight / lineHeight)
    const linesEditable = editableHeight / lineHeight
    console.log('linesEditable / linesMax', linesEditable, linesMax)
    if (evt.key === 'Enter' && linesEditable <= linesMax) {
      evt.preventDefault()
      const [match] = Editor.nodes(editor, {
        match: (n) => Editor.isBlock(editor, n),
      })
      if (match) {
        Transforms.insertNodes(editor, {
          type: 'paragraph',
          children: [{ text: '' }],
        })
      }
    }
  }

  // useEffect(() => {
  //   const checkHeight = () => {
  //     const editorHeight = editorRef.current.offsetHeight
  //     const editableHeight = editableRef.current.offsetHeight

  //     const lineHeight = document.querySelector(
  //       '[data-slate-node=element'
  //     ).offsetHeight

  //     const linesMax = Math.floor(editorHeight / lineHeight)
  //     const linesEditable = editableHeight / lineHeight

  //     if (linesEditable === linesMax) {
  //       console.log('linesMax!!!', linesMax)
  //     }

  //     // console.log('editable', window.getComputedStyle(editableRef.current))

  //     // console.log('lines', linesEditable)

  //     // if (editableHeight >= editorHeight) {
  //     //   // console.log('height^^^^^', Math.floor(editableHeight / editorHeight))
  //     // }
  //   }

  //   checkHeight()
  // }, [value])

  // useEffect(() => {
  //   value.forEach((line, i) => {
  //     console.log(i, '/', line.children[0].text)
  //   })
  // }, [value])

  return (
    <div className="cardeditor">
      <div className="editor" ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Editable ref={editableRef} onKeyDown={handleKeyDown} />
          {/* <TextEditor value={value} /> */}
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
