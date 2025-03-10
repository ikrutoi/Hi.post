import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Editor, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import './CardEditor.scss'
import { addCardtext } from '../../../../../redux/cardEdit/actionCreators'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
import { colorScheme } from '../../../../../data/toolbar/colorScheme'
import scaleBase from '../../../../../data/main/scaleCardAndCardMini.json'
// import listBtnsCardtext from '../../../../../data/cardtext/list-textarea-nav-btns.json'
import { addIconToolbar } from '../../../../../data/toolbar/addIconToolbar'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../../../../../data/toolbar/handleMouse'
import listBtnsCardtext from '../../../../../data/toolbar/listBtnsCardtext.json'
import { changeIconStyles } from '../../../../../data/toolbar/changeIconStyles'
import TooltipColor from './TooltipColor'

const CardEditor = ({
  toolbarColor,
  setChoiceSection,
  styleLeftCardPuzzle,
  //  choiceBtnNav
}) => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const infoButtonsCardtext = useSelector((state) => state.infoButtons.cardtext)
  const inputCardtext = selector.text ? selector : null
  const [cardtext, setCardtext] = useState(inputCardtext)
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(cardtext.text)
  const btnIconRefs = useRef({})
  const btnColorRefs = useRef({})
  const [editable, setEditable] = useState(null)
  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [editableWidth, setEditableWidth] = useState(null)
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [maxLines, setMaxLines] = useState(null)

  const markRef = useRef(null)
  const [markPath, setMarkPath] = useState(null)
  const [btnsCardtext, setBtnsCardtext] = useState({ cardtext: {} })
  // const [btnsColors, setBtnsColors] = useState({ cardtext: {} })
  const [btnColor, setBtnColor] = useState(false)

  const setBtnIconRef = (id) => (element) => {
    btnIconRefs.current[id] = element
  }

  const setBtnColorRef = (id) => (element) => {
    btnColorRefs.current[id] = element
  }

  const dispatch = useDispatch()

  const handleSlateChange = (newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    setCardtext(selector)
  }, [selector])

  useEffect(() => {
    if (listBtnsCardtext && infoButtonsCardtext) {
      setBtnsCardtext((state) => {
        return {
          ...state,
          cardtext: {
            ...state.cardtext,
            ...listBtnsCardtext.reduce((acc, key) => {
              acc[key] = infoButtonsCardtext[key]
              return acc
            }, {}),
          },
        }
      })
    }
  }, [])

  // useEffect(() => {
  //   if (listColors) {
  //     setBtnsColors((state) => {
  //       return {
  //         ...state,
  //         cardtext: {
  //           ...state.cardtext,
  //           ...listColors.reduce((acc, key) => {
  //             acc[key].name = acc[key].code
  //             return acc
  //           }, {}),
  //         },
  //       }
  //     })
  //   }
  // }, [])

  useEffect(() => {
    if (btnsCardtext && btnIconRefs.current) {
      changeIconStyles(btnsCardtext, btnIconRefs.current)
      btnIconRefs.current['cardtext-color'].style.color =
        infoButtonsCardtext.color
    }
  }, [btnsCardtext, btnIconRefs, infoButtonsCardtext])

  useEffect(() => {}, [infoButtonsCardtext])

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef.current])

  useEffect(() => {}, [value])

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

    const scale = (scaleBase.card / scaleBase.cardmini).toFixed(2)
    const heightEditor = editorRef.current.offsetHeight
    const baseSizeLineHeight = Math.floor((heightEditor / lines) * 10) / 10
    const baseFontSize = Math.floor((baseSizeLineHeight / 1.33) * 10) / 10
    dispatch(
      addCardtext({
        fontSize: baseFontSize,
        lineHeight: baseSizeLineHeight,
        miniCardtextStyle: {
          maxLines: lines,
          fontSize: (baseFontSize / scale).toFixed(2),
          lineHeight: (baseSizeLineHeight / scale).toFixed(2),
        },
      })
    )
    setChoiceSection('cardtext')
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
    if (
      editorRef.current &&
      markRef.current &&
      markRef.current.getBoundingClientRect().height !== 0
    ) {
      const markLineCurrent = Math.round(
        editableRef.current.scrollHeight /
          markRef.current.getBoundingClientRect().height
      )
      setLinesCount(markLineCurrent)
      if (markLineCurrent > maxLines && maxLines) {
        console.log('calc+')
        calcStyleAndLinesEditable('increaseLines')
      }
    }
    const creationMark = () => {
      const spanElement = document.createElement('span')
      spanElement.className = 'span-mark'
      spanElement.textContent = ''
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

  // const btnRefs = useRef([])

  // const handleClickToolbar = useCallback(
  //   (evt) => {
  //     const btnTooltip = evt.dataset.tooltip

  //     if (btnTooltip === 'color') {
  //       setToolbarColorActive(true)
  //     }
  //     if (
  //       btnTooltip === 'left' ||
  //       btnTooltip === 'center' ||
  //       btnTooltip === 'right' ||
  //       btnTooltip === 'justify'
  //     ) {
  //       dispatch(addCardtext({ textAlign: evt.dataset.tooltip }))
  //     }
  //   },
  //   [dispatch]
  // )

  // useEffect(() => {
  //   if (choiceBtnNav) {
  //     handleClickToolbar(choiceBtnNav)
  //   }
  // }, [choiceBtnNav, handleClickToolbar])

  // const handleClickColor = (evt) => {
  //   dispatch(
  //     addCardtext({
  //       colorName: evt.target.dataset.colorName,
  //       colorType: evt.target.dataset.colorType,
  //     })
  //   )
  // }

  useEffect(() => {
    dispatch(addCardtext({ text: value }))
  }, [value, dispatch])

  const handleClickBtn = (evt, btn) => {
    if (btn === 'italic') {
      setBtnsCardtext((state) => {
        return {
          ...state,
          cardtext: {
            ...state.cardtext,
            italic: infoButtonsCardtext[btn] === 'hover' ? true : 'hover',
          },
        }
      })
      dispatch(
        infoButtons({
          cardtext: {
            ...infoButtonsCardtext,
            [btn]: infoButtonsCardtext[btn] === 'hover' ? true : 'hover',
          },
        })
      )
    }
    if (
      btn === 'left' ||
      btn === 'center' ||
      btn === 'right' ||
      btn === 'justify'
    ) {
      if (infoButtonsCardtext[btn] === 'hover') {
        evt.preventDefault()
      } else {
        btnIconRefs.current[`cardtext-${btn}`].style.cursor = 'default'
        setBtnsCardtext((state) => {
          return {
            ...state,
            cardtext: {
              ...state.cardtext,
              left: true,
              center: true,
              right: true,
              justify: true,
              [btn]: 'hover',
            },
          }
        })
        dispatch(addCardtext({ textAlign: btn }))
        dispatch(
          infoButtons({
            cardtext: {
              ...infoButtonsCardtext,
              left: true,
              center: true,
              right: true,
              justify: true,
              [btn]: 'hover',
            },
          })
        )
      }
    }
    if (btn === 'color') {
      if (btnColor) {
        setBtnColor(false)
      } else {
        setBtnColor(true)
        console.log(
          'colorStyle'
          // btnIconRefs.current['cardtext-color'].getBoundingClientRect().left
        )
      }
    }
  }

  const handleClickTooltipColor = (evt) => {
    console.log('btnColor', evt.target)
  }

  return (
    <div className="cardeditor">
      <div className="cardeditor-container">
        {listBtnsCardtext &&
          listBtnsCardtext.map((btn, i) => {
            return (
              <button
                key={`${i}-${btn}`}
                data-tooltip={btn}
                data-section={'cardtext'}
                ref={setBtnIconRef(`cardtext-${btn}`)}
                className={`toolbar-btn toolbar-btn-cardtext btn-cardtext-${btn}`}
                onClick={(evt) => handleClickBtn(evt, btn)}
                onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
                onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
              >
                {addIconToolbar(btn)}
              </button>
            )
          })}
        {btnColor && (
          <TooltipColor
            setBtnColor={setBtnColor}
            infoButtonsCardtext={infoButtonsCardtext}
            styleLeft={
              btnIconRefs.current['cardtext-color'].getBoundingClientRect()
                .left - styleLeftCardPuzzle
            }
          />
        )}
      </div>
      <div className="editor" ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleSlateChange}
        >
          <Editable
            placeholder="Hi)"
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
