import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Editor, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import './CardEditor.scss'
import { addCardtext } from '../../../../../redux/cardEdit/actionCreators'
import { infoButtons } from '../../../../../redux/infoButtons/actionCreators'
import { colorScheme } from '../../../../../data/toolbar/colorScheme'
import { colorSchemeMain } from '../../../../../data/main/colorSchemeMain'
import scaleBase from '../../../../../data/main/scaleCardAndCardMini.json'
// import listBtnsCardtext from '../../../../../data/cardtext/list-textarea-nav-btns.json'
import { addIconToolbar } from '../../../../../data/toolbar/addIconToolbar'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '../../../../../data/toolbar/handleMouse'
import {
  addRecordCardtext,
  addUniqueRecordCardtext,
  deleteRecordCardtext,
  getRecordCardtextById,
  getCountRecordsCardtext,
  getAllRecordCardtext,
} from '../../../../../utils/cardFormNav/indexDB/indexDb'
import listBtnsCardtext from '../../../../../data/toolbar/listBtnsCardtext.json'
import listBtnsCardtextMain from '../../../../../data/toolbar/listBtnsCardtextMain.json'
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
  // const btnIconMainRefs = useRef({})
  const btnColorRefs = useRef({})
  const [editable, setEditable] = useState(null)
  const editorRef = useRef(null)
  const editableRef = useRef(null)
  const [editableWidth, setEditableWidth] = useState(null)
  const [linesCount, setLinesCount] = useState(1)
  const [focusedElement, setFocusedElement] = useState(null)
  const [maxLines, setMaxLines] = useState(null)
  const [memoryCardtext, setMemoryCardtext] = useState(null)

  const markRef = useRef(null)
  const [markPath, setMarkPath] = useState(null)
  const [btnsCardtext, setBtnsCardtext] = useState({ cardtext: {} })
  // const [btnsCardtextMain, setBtnsCardtextMain] = useState({ cardtext: {} })
  // const [btnsColors, setBtnsColors] = useState({ cardtext: {} })
  const [btnColor, setBtnColor] = useState(false)

  const setBtnIconRefs = (id) => (element) => {
    btnIconRefs.current[id] = element
  }
  // const setBtnIconMainRefs = (id) => (element) => {
  //   btnIconMainRefs.current[id] = element
  // }

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
    if (listBtnsCardtextMain && infoButtonsCardtext) {
      setBtnsCardtext((state) => {
        return {
          ...state,
          cardtext: {
            ...state.cardtext,
            ...listBtnsCardtextMain.reduce((acc, key) => {
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
    }
  }, [btnsCardtext, btnIconRefs])

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef.current])

  useEffect(() => {
    setBtnsCardtext((state) => {
      return {
        ...state,
        cardtext: {
          ...state.cardtext,
          save: value[0].children[0].text.length ? true : false,
          delete: value[0].children[0].text.length ? true : false,
        },
      }
    })
    dispatch(
      infoButtons({
        cardtext: {
          ...infoButtonsCardtext,
          save: value[0].children[0].text.length ? true : false,
          delete: value[0].children[0].text.length ? true : false,
        },
      })
    )

    const getCountCardtexts = async () => {
      const countCardtexts = Boolean(await getCountRecordsCardtext())

      if (countCardtexts) {
        const listCardtexts = await getAllRecordCardtext()
        setMemoryCardtext((state) => {
          return {
            ...state,
            listCardtexts,
          }
        })
      }

      setBtnsCardtext((state) => {
        return {
          ...state,
          cardtext: {
            ...state.cardtext,
            clip: countCardtexts ? true : false,
          },
        }
      })
      dispatch(
        infoButtons({
          cardtext: {
            ...infoButtonsCardtext,
            clip: countCardtexts ? true : false,
          },
        })
      )
    }

    getCountCardtexts()

    // const processCardtext = async (value) => {
    //   for (const section of Object.keys(value)) {
    //     // checkField(section)
    //     await getCountCardtexts()
    //   }
    // }

    // processCardtext(value)
  }, [value])

  // console.log('memoryCardtext', memoryCardtext)

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
      }
    }
  }

  // const getCountCardtexts = async (section) => {
  //   const countCardtexts = Boolean(await getCountRecordsCardtext())

  //   if (countCardtexts) {
  //     const listCardtexts = await getRecordAllCardtext()
  //     setMemoryCardtext((state) => {
  //       return {
  //         ...state,
  //         listCardtexts,
  //       }
  //     })
  //   }

  //   setBtnsCardtext((state) => {
  //     return {
  //       ...state,
  //       cardtext: {
  //         ...state.cardtext,
  //         clip: countCardtexts ? true : false,
  //       },
  //     }
  //   })
  // }

  const handleClickBtnMain = async (evt) => {
    const parentBtn = evt.target.closest('.toolbar-btn')
    switch (parentBtn.dataset.tooltip) {
      case 'save':
        console.log('value', value)
        await addUniqueRecordCardtext(value)
        break
      case 'delete':
        // await addUniqueRecordCardtext(value)
        break
      case 'clip':
        // const allTexts = await getRecordAllCardtext()
        // console.log('All texts', allTexts)
        if (btnsCardtext.cardtext.clip) {
          setBtnsCardtext((state) => {
            return {
              ...state,
              cardtext: {
                ...state.cardtext,
                clip: btnsCardtext.cardtext.clip === true ? 'hover' : true,
              },
            }
          })
          dispatch(
            infoButtons({
              cardtext: {
                ...infoButtonsCardtext,
                clip: btnsCardtext.cardtext.clip === true ? 'hover' : true,
              },
            })
          )
        }

        break

      default:
        break
    }
  }

  return (
    <div className="cardeditor">
      <div className="cardeditor-container">
        <div className="cardeditor-container-left">
          {listBtnsCardtext &&
            listBtnsCardtext.map((btn, i) => {
              return (
                <button
                  className={`toolbar-btn toolbar-btn-cardtext btn-cardtext-${btn}`}
                  key={`${i}-${btn}`}
                  data-tooltip={btn}
                  data-section={'cardtext'}
                  ref={setBtnIconRefs(`cardtext-${btn}`)}
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
        <div className="cardeditor-container-right">
          {listBtnsCardtextMain.map((btn, i) => {
            return (
              <button
                className={`toolbar-btn toolbar-btn-cardtext-main btn-cardtext-main-${btn}`}
                ref={setBtnIconRefs(`cardtext-${btn}`)}
                key={`main-${i}-${btn}`}
                data-tooltip={btn}
                data-section={'cardtext'}
                onClick={handleClickBtnMain}
                onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
                onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
              >
                {addIconToolbar(btn)}
              </button>
            )
          })}
        </div>
      </div>
      {/* <div className="ggg"></div> */}
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
