import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact, useSlateStatic } from 'slate-react'
import './CardEditor.scss'
import Toolbar from '../Toolbar/Toolbar'
import Mark from './Mark/Mark'

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
  const markRef = useRef([])
  const lastLineRef = useRef(null)
  const lastElementRef = useRef(null)

  const [markRefLength, setMarkRefLength] = useState(markRef.current.length)
  const [linesCount, setLinesCount] = useState(1)

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

  // const getLastNestedElement = (element) => {
  //   while (element && element.lastElementChild) {
  //     element = element.lastElementChild
  //   }
  //   return element
  // }

  // const insertMark = (parentElement) => {
  //   if (parentElement) {
  //     setMarkVisible(true)
  //   }
  // }

  // const getLastElement = (e) => {
  //   while (e.children.length > 0) {
  //     if (e.children[e.children.length - 1] === markRef.current) {
  //       e.children[e.children.length - 1].remove()
  //     } else {
  //       e = e.children[e.children.length - 1]
  //     }
  //   }
  //   return e
  // }

  // const removeLastMark = () => {
  //   if (markRef.current) {
  //     markRef.current.remove()
  //   }
  // }

  // const getEndOfText = () => {
  //   const lastElement = getLastElement(editableRef.current)
  //   insertMark(lastElement)
  // }

  useEffect(() => {
    if (editableRef.current) {
      const lastLine = editableRef.current.lastElementChild

      const findLastElementInLine = (el) => {
        if (!el.children || el.children.length === 0) {
          return el
        }
        return findLastElementInLine(el.children[el.children.length - 1])
      }

      const lastElement = findLastElementInLine(lastLine)
      if (lastElement) {
        // console.log('find last element', lastElement)
      }
    }
  }, [value])

  const getLastLine = () => {
    const elemEditable = document.querySelector(`[data-slate-node="value"]`)
    // const elemMark = document.querySelector('.cardtext-mark')

    if (elemEditable) {
      const lastLine = elemEditable.lastElementChild
      const findDeepestElement = (element) => {
        let deepestElement = element
        let deepestLevel = 0
        const traverse = (currentElement, currentLevel) => {
          if (currentLevel > deepestLevel) {
            deepestLevel = currentLevel
            deepestElement = currentElement
          }
          Array.from(currentElement.children).forEach((child) => {
            traverse(child, currentLevel + 1)
          })
        }
        traverse(element, 0)
        return deepestElement
      }
      const deepestElement = findDeepestElement(lastLine)
      console.log('The most recent nested element:', deepestElement)
    }
  }

  const handleChangeSlate = (newValue) => {
    setValue(newValue)
    const linesCountNow = newValue.filter(
      (node) => node.type === 'paragraph'
    ).length
    if (linesCount !== linesCountNow) setLinesCount(linesCountNow)

    // console.log('linesCount', linesCount1.length)
  }

  // const handleChangeSlate = (newValue) => {
  //   const elemEditable = document.querySelector(`[data-slate-node="value"]`)
  //   const elemMark = document.querySelector('.cardtext-mark')

  //   if (elemEditable) {
  //     const lastLine = elemEditable.lastElementChild
  //     const findDeepestElement = (element) => {
  //       let deepestElement = element
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
  //       traverse(element, 0)
  //       return deepestElement
  //     }
  //     const deepestElement = findDeepestElement(lastLine)
  //     console.log('Самый последний вложенный элемент:', deepestElement)
  //   }

  //   const linesEditable = getSizeEditorAndEditable().linesEditable
  //   const linesMax = getSizeEditorAndEditable().linesMax

  //   if (linesEditable >= linesMax) {
  //     // console.log('length', newValue[newValue.length - 1].children[0].text)
  //   }
  //   return setValue(newValue)
  // }

  const handleKeyDown = (evt) => {
    const linesEditable = getSizeEditorAndEditable().linesEditable
    const linesMax = getSizeEditorAndEditable().linesMax
    if (evt.key === 'Enter') {
      // removeLastMark()
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

  const setMarkRef = useCallback((node) => {
    if (node && !markRef.current.includes(node)) {
      markRef.current.push(node)
      setMarkRefLength(markRef.current.length)
    }
  }, [])

  useEffect(() => {
    console.log('lines:', linesCount)
    getLastLine()
  }, [linesCount])

  useEffect(() => {
    // console.log('markRefLength0', markRefLength)
    if (markRefLength > 1) {
      for (let i = 0; i < markRefLength - 1; i++) {
        markRef.current[i].remove()
      }
    }
    markRef.current.splice(0, markRefLength - 1)
    setMarkRefLength(markRef.current.length)
  }, [markRefLength])

  const renderLeaf = ({ attributes, children }) => {
    // if (editableRef.current) {
    //   const numberLines = document.querySelectorAll(
    //     `[data-slate-node="element"]`
    //   ).length
    //   console.log('renderLeaf.lines1', numberLines)
    //   if (numberLines !== linesCount) {
    //     console.log('renderLeaf.lines11', numberLines)
    //     setLinesCount(numberLines)
    //   }
    // }
    // if (editableRef.current) {
    //   const numberLines = document.querySelectorAll(
    //     `[data-slate-node="element"]`
    //   )
    //   setLineInEditable(numberLines)
    //   console.log('**', linesInEditable)
    // }
    //     if (markRef.current) {
    //   markRef.current.remove()
    //   markRef.current = null
    // }
    // const elemEditable = document.querySelector(`[data-slate-node="value"]`)
    // const elemMark = document.querySelector('.cardtext-mark')

    // if (elemEditable) {
    //   const lastLine = elemEditable.lastElementChild
    //   const findDeepestElement = (element) => {
    //     let deepestElement = element
    //     let deepestLevel = 0
    //     const traverse = (currentElement, currentLevel) => {
    //       if (currentLevel > deepestLevel) {
    //         deepestLevel = currentLevel
    //         deepestElement = currentElement
    //       }
    //       Array.from(currentElement.children).forEach((child) => {
    //         traverse(child, currentLevel + 1)
    //       })
    //     }
    //     traverse(element, 0)
    //     return deepestElement
    //   }
    //   const deepestElement = findDeepestElement(lastLine)
    //   console.log('Самый последний вложенный элемент:', deepestElement)
    // }
    // if (elemEditable) {
    //   lastLineRef.current = lastLine
    //   // console.log('lastLine1:', lastLine)

    // const findNestedElement = (element, mark) => {
    //     if (element.matches(mark)) {
    //       return (
    //         <span {...attributes}>
    //                   {children}
    //                 </span>
    //               )
    //             }
    //             for (let child of element.children) {
    //               findNestedElement(child, mark)
    //             }
    //           }()
    //         }
    //         findNestedElement(lastLine, elemMark)
    //       }

    //       console.log('lastNode', )

    return (
      <span {...attributes}>
        {children}
        {/* <Mark ref={setMarkRef} /> */}
      </span>
    )

    //   findNestedElement()

    // while (lastLine) {
    //   // console.log('lastLine2:', lastLine)
    //   // console.log('children', children)
    //   if (lastLineRef.current === lastLine) {
    //     // console.log('+', text)
    //     return (
    //       <span {...attributes}>
    //         {children}
    //         {<Mark />}
    //       </span>
    //     )
    //   }
    //   lastLine = lastLine.parentElement
    // }
    // // console.log('-', text)
    // lastLineRef.current.remove()
    // lastLineRef.current = null
    // }
    // if (markRef.current) {
    //   console.log('*', markRef.current.parentElement)
    // }

    // return (
    //   <span {...attributes}>
    //     {children}
    //     <Mark ref={setMarkRef} />
    //   </span>
    // )
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
          <Toolbar editor={editor} />
          <Editable
            ref={editableRef}
            onKeyDown={handleKeyDown}
            // renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
