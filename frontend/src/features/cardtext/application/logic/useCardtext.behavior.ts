import { useEffect, useRef, useState } from 'react'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@app/state'
import { cardScaleFactors } from '@shared/config/card'
import { applyIconStylesByStatus } from '@shared/lib/dom'
// import { updateButtonsState } from '@features/infobuttons/application/state/infoButtonsSlice'
// import { setActiveSections } from '@features/layout/application/state/layoutSlice'
// import { addCardtext } from '@features/cardedit/application/state/cardEditSlice'
import { updateToolbar } from '@toolbar/infrastructure/state'
import { updateCardtext } from '@cardtext/infrastructure/state'
import type { CardtextToolbarKey } from '@features/toolbar/domain/types'
import type { State } from '@shared/config/theme'
import { updateCard } from '@/app/state/slices/cardsSlice'

export const useCardtextBehavior = (editor: Editor) => {
  const dispatch = useDispatch()
  const storeToolbarCardtext = useSelector(
    (state: RootState) => state.toolbar.cardtext
  )
  const storeCardtext = useSelector((state: RootState) => state.cardtext)
  // const layoutActiveSections = useSelector(
  //   (state: RootState) => state.layout.setActiveSections
  // )

  const [value, setValue] = useState<any[]>([])
  const [buttonColor, setButtonColor] = useState(false)
  const [cardtextToolbar, setCardtextToolbar] = useState<{
    cardtext: Partial<Record<CardtextToolbarKey, State>>
  }>({ cardtext: {} })

  const [maxLines, setMaxLines] = useState<number | null>(null)
  const [markPath, setMarkPath] = useState<any>(null)

  const editorRef = useRef<HTMLDivElement | null>(null)
  const editableRef = useRef<HTMLDivElement | null>(null)
  const buttonIconRefs = useRef<Record<string, HTMLElement | null>>({})
  // const markRef = useRef<HTMLElement | null>(null)

  const setBtnIconRefs = (id: string) => (element: HTMLElement | null) => {
    buttonIconRefs.current[id] = element
  }

  const handleSlateChange = (newValue: any) => {
    setValue(newValue)
  }

  const handleClickButton = (
    evt: React.MouseEvent<HTMLButtonElement>,
    key: CardtextToolbarKey
  ) => {
    if (key === 'italic') {
      const currentState =
        storeToolbarCardtext[key] === 'active' ? 'active' : 'enabled'

      setCardtextToolbar((state) => ({
        cardtext: {
          ...state.cardtext,
          [key]: currentState,
        },
      }))

      dispatch(
        updateToolbar({
          cardtext: {
            ...storeToolbarCardtext,
            [key]: currentState,
          },
        })
      )
    }

    const alignmentKeys: CardtextToolbarKey[] = [
      'left',
      'center',
      'right',
      'justify',
    ]

    if (alignmentKeys.includes(key)) {
      if (storeToolbarCardtext[key] === 'active') {
        evt.preventDefault()
      } else {
        const buttonIcon = buttonIconRefs.current[`cardtext-${key}`]
        if (buttonIcon) buttonIcon.style.cursor = 'default'

        const newState: Partial<Record<CardtextToolbarKey, State>> = {
          left: 'enabled',
          center: 'enabled',
          right: 'enabled',
          justify: 'enabled',
          [key]: 'active',
        }

        setCardtextToolbar((state) => ({
          ...state,
          cardtext: newState,
        }))

        dispatch(
          updateCardtext({
            ...storeCardtext,
            textAlign: key,
          })
        )
        // dispatch(updateButtonsState({ cardtext: newState }))
      }
    }

    if (key === 'color') {
      setButtonColor((prev) => !prev)
    }
  }

  const handleClickButtonMain = async (
    evt: React.MouseEvent<HTMLButtonElement>
  ) => {
    const parentButton = (evt.target as HTMLElement).closest(
      '.toolbar-key'
    ) as HTMLElement | null
    if (!parentButton?.dataset.tooltip) return

    const key = parentButton.dataset.tooltip

    if (key === 'delete') {
      clearEditor()
      Transforms.insertNodes(editor, [
        {
          // type: 'paragraph',
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
      updateCardtext({
        ...storeCardtext,
        fontSize: baseFontSize,
        lineHeight: baseSizeLineHeight,
        miniCardtextStyle: {
          maxLines: lines,
          fontSize: parseFloat((baseFontSize / Number(scale)).toFixed(2)),
          lineHeight: parseFloat(
            (baseSizeLineHeight / Number(scale)).toFixed(2)
          ),
        },
      })
    )

    // dispatch(
    //   addCardtext({
    //     fontSize: baseFontSize,
    //     lineHeight: baseSizeLineHeight,
    //     miniCardtextStyle: {
    //       maxLines: lines,
    //       fontSize: (baseFontSize / Number(scale)).toFixed(2),
    //       lineHeight: (baseSizeLineHeight / Number(scale)).toFixed(2),
    //     },
    //   })
    // )

    setMaxLines(lines)
  }

  useEffect(() => {
    if (cardtextToolbar && buttonIconRefs.current) {
      applyIconStylesByStatus(cardtextToolbar, buttonIconRefs.current)
    }
  }, [cardtextToolbar])

  useEffect(() => {
    if (editorRef.current) {
      calcStyleAndLinesEditable('startLines')
    }
  }, [editorRef.current])

  return {
    value,
    setValue,
    cardtextToolbar,
    handleClickButton,
    handleClickButtonMain,
    handleSlateChange,
    editorRef,
    editableRef,
    buttonColor,
    setButtonColor,
    buttonIconRefs,
    setBtnIconRefs,
    markPath,
    setMarkPath,
  }
}
