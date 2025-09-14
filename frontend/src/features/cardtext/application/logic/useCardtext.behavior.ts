import { useEffect, useRef, useState } from 'react'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateButtonsState } from '@/features/infobuttons/application/state/infoButtonsSlice'
import { setActiveSections } from '@/features/layout/application/state/layoutSlice'
import { RootState } from '@/app/store'
import { cardScaleFactors } from '@/shared/config/layout/cardScaleFactors'
import { addCardtext } from '@/features/cardedit/application/state/cardEditSlice'
import { changeIconStyles } from '@/features/cardtext/utils/changeIconStyles'

export const useCardtextBehavior = (editor: Editor) => {
  const dispatch = useDispatch()

  const infoBtnsCardtext = useSelector(
    (state: RootState) => state.infoButtons.cardtext
  )
  const layoutActiveSections = useSelector(
    (state: RootState) => state.layout.setActiveSections
  )

  const [value, setValue] = useState<any[]>([])
  const [btnColor, setBtnColor] = useState(false)
  const [btnsCardtext, setBtnsCardtext] = useState({
    cardtext: {} as Record<string, boolean>,
  })
  const [maxLines, setMaxLines] = useState<number | null>(null)
  const [markPath, setMarkPath] = useState<any>(null)

  const editorRef = useRef<HTMLDivElement | null>(null)
  const editableRef = useRef<HTMLDivElement | null>(null)
  const btnIconRefs = useRef<Record<string, HTMLElement | null>>({})
  const markRef = useRef<HTMLElement | null>(null)

  const setBtnIconRefs = (id: string) => (element: HTMLElement | null) => {
    btnIconRefs.current[id] = element
  }

  const handleSlateChange = (newValue: any) => {
    setValue(newValue)
  }

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

        const newState = {
          left: true,
          center: true,
          right: true,
          justify: true,
          [btn]: 'hover',
        }

        setBtnsCardtext((state) => ({
          ...state,
          cardtext: newState,
        }))

        dispatch(addCardtext({ textAlign: btn }))
        dispatch(updateButtonsState({ cardtext: newState }))
      }
    }

    if (btn === 'color') {
      setBtnColor((prev) => !prev)
    }
  }

  const handleClickBtnMain = async (
    evt: React.MouseEvent<HTMLButtonElement>
  ) => {
    const parentBtn = (evt.target as HTMLElement).closest(
      '.toolbar-btn'
    ) as HTMLElement | null
    if (!parentBtn?.dataset.tooltip) return

    const btn = parentBtn.dataset.tooltip

    if (btn === 'delete') {
      clearEditor()
      Transforms.insertNodes(editor, [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ])
    }
  }

  const clearEditor = () => {
    const clearNode = () => {
      Transforms.removeNodes(editor, { at: [0] })
      if (editor.children.length > 0) clearNode()
    }
    if (editor.children.length > 0) clearNode()
  }

  const calcStyleAndLinesEditable = (condition: string) => {
    let lines = condition === 'increaseLines' && maxLines ? maxLines + 1 : 12
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

  useEffect(() => {
    if (btnsCardtext && btnIconRefs.current) {
      changeIconStyles(btnsCardtext, btnIconRefs.current)
    }
  }, [btnsCardtext])

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef.current])

  return {
    value,
    setValue,
    btnsCardtext,
    handleClickBtn,
    handleClickBtnMain,
    handleSlateChange,
    editorRef,
    editableRef,
    btnColor,
    setBtnColor,
    btnIconRefs,
    setBtnIconRefs,
    markPath,
    setMarkPath,
  }
}
