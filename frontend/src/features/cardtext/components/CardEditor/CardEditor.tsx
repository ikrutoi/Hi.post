import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createEditor, Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'

import './CardEditor.scss'
import { TooltipColor } from './TooltipColor'

import { RootState } from '@/app/store'
import { addCardtext } from '@/features/cardedit/model/store/cardEditSlice'
import { updateButtonsState } from '@/features/infobuttons/model/store/infoButtonsSlice'
import {
  setChoiceSave,
  setChoiceClip,
  setActiveSections,
} from '@/features/layout/model/store/layoutSlice'

import { colorScheme } from '@/shared/data/toolbar/colorScheme'
import { colorSchemeMain } from '@/shared/data/main/colorSchemeMain'
import { cardScaleFactors } from '@shared/config/layout/cardScaleFactors'

import listBtnsCardtext from '@/shared/data/toolbar/listBtnsCardtext.json'
import listBtnsCardtextMain from '@/shared/data/toolbar/listBtnsCardtextMain.json'

import { addIconToolbar } from '@/shared/data/toolbar/getIconElement'
import {
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
} from '@/shared/data/toolbar/handleMouse'
import {
  addRecordCardtext,
  addUniqueRecordCardtext,
  deleteRecordCardtext,
  getRecordCardtextById,
  getCountRecordsCardtext,
  getAllRecordCardtext,
} from '@/shared/lib/cardFormNav/indexDB/indexDb'
import { changeIconStyles } from '@/shared/data/toolbar/changeIconStyles'

import type { CardEditorProps } from '@/features/cardtext/model/types'

export const CardEditor: React.FC<CardEditorProps> = ({
  toolbarColor,
  styleLeftCardPuzzle,
}) => {
  const dispatch = useDispatch()

  const fullCard = useSelector((state: RootState) => state.layout.fullCard)
  const cardEditCardtext = useSelector(
    (state: RootState) => state.cardEdit.cardtext
  )
  const infoBtnsCardtext = useSelector(
    (state: RootState) => state.infoButtons.cardtext
  )
  const memorySection = useSelector(
    (state: RootState) => state.layout.choiceMemorySection
  )
  const layoutActiveSections = useSelector(
    (state: RootState) => state.layout.setActiveSections
  )

  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(cardEditCardtext.text)

  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const btnColorRefs = useRef<Record<string, HTMLElement | null>>({})
  const editorRef = useRef<HTMLDivElement | null>(null)
  const editableRef = useRef<HTMLDivElement | null>(null)
  const markRef = useRef<HTMLElement | null>(null)

  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
  const [maxLines, setMaxLines] = useState<number | null>(null)
  const [memoryCardtext, setMemoryCardtext] = useState<any>(null)
  const [markPath, setMarkPath] = useState<any>(null)
  const [btnsCardtext, setBtnsCardtext] = useState<{
    cardtext: Record<string, boolean>
  }>({
    cardtext: {},
  })
  const [btnColor, setBtnColor] = useState(false)

  const setBtnIconRefs = (id: string) => (element: HTMLElement | null) => {
    btnIconRefs.current[id] = element
  }

  const setBtnColorRef = (id: string) => (element: HTMLElement | null) => {
    btnColorRefs.current[id] = element
  }

  const handleSlateChange = (newValue: any) => {
    setValue(newValue)
  }

  const getCardtextFromMemory = async (id: string) => {
    const valueFromMemory = await getRecordCardtextById(id)
    if (valueFromMemory) {
      const arrKeys = Object.keys(valueFromMemory.text)
      const nodes = arrKeys.map((i) => valueFromMemory.text[i])
      clearEditor()
      setValue(nodes)
      Transforms.insertNodes(editor, nodes)
    }
  }

  useEffect(() => {
    if (memorySection.section === 'cardtext') {
      getCardtextFromMemory(memorySection.id)
    }
  }, [memorySection])

  useEffect(() => {
    if (listBtnsCardtext && infoBtnsCardtext) {
      setBtnsCardtext((state) => ({
        ...state,
        cardtext: {
          ...state.cardtext,
          ...listBtnsCardtext.reduce(
            (acc, key) => {
              acc[key] = infoBtnsCardtext[key]
              return acc
            },
            {} as Record<string, boolean>
          ),
        },
      }))
    }
    if (listBtnsCardtextMain && infoBtnsCardtext) {
      setBtnsCardtext((state) => ({
        ...state,
        cardtext: {
          ...state.cardtext,
          ...listBtnsCardtextMain.reduce(
            (acc, key) => {
              acc[key] = infoBtnsCardtext[key]
              return acc
            },
            {} as Record<string, boolean>
          ),
        },
      }))
    }
  }, [])

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
    const hasText = value?.[0]?.children?.[0]?.text?.length > 0

    setBtnsCardtext((state) => ({
      ...state,
      cardtext: {
        ...state.cardtext,
        save: hasText,
        delete: hasText,
      },
    }))

    dispatch(
      updateButtonsState({
        cardtext: {
          ...infoBtnsCardtext,
          save: hasText,
          delete: hasText,
        },
      })
    )

    dispatch(
      setActiveSections({
        ...layoutActiveSections,
        cardtext: hasText,
      })
    )

    const getCountCardtexts = async () => {
      const countCardtexts = Boolean(await getCountRecordsCardtext())

      if (countCardtexts) {
        const listCardtexts = await getAllRecordCardtext()
        setMemoryCardtext((state: any) => ({
          ...state,
          listCardtexts,
        }))
      }

      setBtnsCardtext((state) => ({
        ...state,
        cardtext: {
          ...state.cardtext,
          clip: countCardtexts,
        },
      }))

      dispatch(
        updateButtonsState({
          cardtext: {
            ...infoBtnsCardtext,
            clip: countCardtexts,
          },
        })
      )
    }

    if (infoBtnsCardtext.clip !== 'hover') {
      getCountCardtexts()
    }
  }, [value])

  const calcStyleAndLinesEditable = (condition: string) => {
    let lines = 12
    if (condition === 'increaseLines' && maxLines) {
      lines = maxLines + 1
    }

    const scale = (cardScaleFactors.card / cardScaleFactors.miniCard).toFixed(2)
    const heightEditor = editorRef.current?.offsetHeight ?? 0
    const baseSizeLineHeight = Math.floor((heightEditor / lines) * 10) / 10
    const baseFontSize = Math.floor((baseSizeLineHeight / 1.33) * 10) / 10

    dispatch(
      addCardtext({
        fontSize: baseFontSize,
        lineHeight: baseSizeLineHeight,
        miniCardtextStyle: {
          maxLines: lines,
          fontSize: (baseFontSize / Number(scale)).toFixed(2),
          lineHeight: (baseSizeLineHeight / Number(scale)).toFixed(2),
        },
      })
    )

    setMaxLines(lines)
  }

  const arrayCompare = (arr1: any[], arr2: any[]): boolean => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false
    return arr1.every((val, i) => val === arr2[i])
  }

  const getDeepestChild = (element: any): any => {
    if (!element.children?.length) return element
    return getDeepestChild(element.children[element.children.length - 1])
  }
  useEffect(() => {
    if (
      editorRef.current &&
      markRef.current &&
      markRef.current.getBoundingClientRect().height !== 0
    ) {
      const markLineCurrent = Math.round(
        (editableRef.current?.scrollHeight ?? 0) /
          markRef.current.getBoundingClientRect().height
      )

      if (markLineCurrent > (maxLines ?? 0)) {
        calcStyleAndLinesEditable('increaseLines')
      }
    }

    const creationMark = (): HTMLSpanElement => {
      const spanElement = document.createElement('span')
      spanElement.className = 'span-mark'
      spanElement.textContent = ''
      spanElement.contentEditable = 'false'
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
  }, [editor, value, markPath])

  useEffect(() => {
    dispatch(addCardtext({ text: value }))
  }, [value, dispatch])

  const handleClickBtn = (
    evt: React.MouseEvent<HTMLButtonElement>,
    btn: string
  ) => {
    if (btn === 'italic') {
      const nextState = infoBtnsCardtext[btn] === 'hover' ? true : 'hover'
      setBtnsCardtext((state) => ({
        ...state,
        cardtext: {
          ...state.cardtext,
          italic: nextState,
        },
      }))
      dispatch(
        updateButtonsState({
          cardtext: {
            ...infoBtnsCardtext,
            [btn]: nextState,
          },
        })
      )
    }

    if (['left', 'center', 'right', 'justify'].includes(btn)) {
      if (infoBtnsCardtext[btn] === 'hover') {
        evt.preventDefault()
      } else {
        const icon = btnIconRefs.current[`cardtext-${btn}`]
        if (icon) icon.style.cursor = 'default'

        setBtnsCardtext((state) => ({
          ...state,
          cardtext: {
            ...state.cardtext,
            left: true,
            center: true,
            right: true,
            justify: true,
            [btn]: 'hover',
          },
        }))

        dispatch(addCardtext({ textAlign: btn }))
        dispatch(
          updateButtonsState({
            cardtext: {
              ...infoBtnsCardtext,
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
      setBtnColor((prev) => !prev)
    }
  }

  const clearEditor = () => {
    const clearNode = () => {
      Transforms.removeNodes(editor, { at: [0] })
      if (editor.children.length > 0) {
        clearNode()
      }
    }

    if (editor.children.length > 0) {
      clearNode()
    }
  }

  const handleClickBtnMain = async (
    evt: React.MouseEvent<HTMLButtonElement>
  ) => {
    const parentBtn = (evt.target as HTMLElement).closest(
      '.toolbar-btn'
    ) as HTMLElement | null

    if (!parentBtn?.dataset.tooltip) return

    switch (parentBtn.dataset.tooltip) {
      case 'save':
        await addUniqueRecordCardtext(value)
        if (btnsCardtext.cardtext.clip === true) {
          setBtnsCardtext((state) => ({
            ...state,
            cardtext: {
              ...state.cardtext,
              clip: 'hover',
            },
          }))
          dispatch(
            updateButtonsState({
              cardtext: {
                clip: 'hover',
              },
            })
          )
          dispatch(setChoiceClip('cardtext'))
        }
        dispatch(setChoiceSave('cardtext'))
        break

      case 'delete':
        clearEditor()
        Transforms.insertNodes(editor, [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ])
        break

      case 'clip':
        if (btnsCardtext.cardtext.clip) {
          const nextState = btnsCardtext.cardtext.clip === true ? 'hover' : true
          setBtnsCardtext((state) => ({
            ...state,
            cardtext: {
              ...state.cardtext,
              clip: nextState,
            },
          }))
          dispatch(
            updateButtonsState({
              cardtext: {
                ...infoBtnsCardtext,
                clip: nextState,
              },
            })
          )
        }
        break

      default:
        break
    }
  }
  useEffect(() => {
    infoBtnsCardtext.clip === 'hover'
      ? dispatch(setChoiceClip('cardtext'))
      : dispatch(setChoiceClip(false))
  }, [infoBtnsCardtext, dispatch])

  return (
    <div className="cardeditor">
      <div className="cardeditor-container">
        <div className="cardeditor-container-left">
          {listBtnsCardtext.map((btn, i) => (
            <button
              className={`toolbar-btn toolbar-btn-cardtext btn-cardtext-${btn}`}
              key={`${i}-${btn}`}
              data-tooltip={btn}
              data-section="cardtext"
              ref={setBtnIconRefs(`cardtext-${btn}`)}
              onClick={(evt) => handleClickBtn(evt, btn)}
              onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
              onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
            >
              {addIconToolbar(btn)}
            </button>
          ))}
          {btnColor && (
            <TooltipColor
              setBtnColor={setBtnColor}
              infoButtonsCardtext={infoBtnsCardtext}
              styleLeft={
                (btnIconRefs.current['cardtext-color']?.getBoundingClientRect()
                  .left ?? 0) - styleLeftCardPuzzle
              }
            />
          )}
        </div>
        <div className="cardeditor-container-right">
          {listBtnsCardtextMain.map((btn, i) => (
            <button
              className={`toolbar-btn toolbar-btn-cardtext-main btn-cardtext-main-${btn}`}
              ref={setBtnIconRefs(`cardtext-${btn}`)}
              key={`main-${i}-${btn}`}
              data-tooltip={btn}
              data-section="cardtext"
              onClick={handleClickBtnMain}
              onMouseEnter={(evt) => handleMouseEnterBtn(evt, btnsCardtext)}
              onMouseLeave={(evt) => handleMouseLeaveBtn(evt, btnsCardtext)}
            >
              {addIconToolbar(btn)}
            </button>
          ))}
        </div>
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
            style={{
              fontSize: `${cardEditCardtext.fontSize}px`,
              lineHeight: `${cardEditCardtext.lineHeight}px`,
              color: cardEditCardtext.colorType,
              fontStyle: cardEditCardtext.fontStyle,
              fontWeight: cardEditCardtext.fontWeight,
              textAlign: cardEditCardtext.textAlign,
            }}
            ref={editableRef}
          />
        </Slate>
      </div>
    </div>
  )
}

export default CardEditor
