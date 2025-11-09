import { useEffect, useRef, useState } from 'react'
import { Transforms, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { RootState } from '@app/state'
import { useLayoutFacade } from '@layout/application/facades'
import { applyIconStylesByStatus } from '@shared/lib/dom'
import { toolbarActions } from '@toolbar/infrastructure/state'
import { cardtextActions } from '@cardtext/infrastructure/state'
import { isTextAlignKey } from '../helpers'
import type { CardtextToolbarKey } from '@features/toolbar/domain/types'
import type { IconState } from '@shared/config/constants'

export const useCardtextBehavior = (editor: Editor) => {
  const dispatch = useAppDispatch()
  const storeToolbarCardtext = useAppSelector(
    (state: RootState) => state.toolbar.cardtext
  )
  const storeCardtext = useAppSelector((state: RootState) => state.cardtext)

  const { size } = useLayoutFacade()
  const { scale } = size

  const [value, setValue] = useState<any[]>([])
  const [buttonColor, setButtonColor] = useState(false)
  const [cardtextToolbar, setCardtextToolbar] = useState<{
    cardtext: Partial<Record<CardtextToolbarKey, IconState>>
  }>({ cardtext: {} })

  const [maxLines, setMaxLines] = useState<number | null>(null)
  const [markPath, setMarkPath] = useState<any>(null)

  const editorRef = useRef<HTMLDivElement | null>(null)
  const editableRef = useRef<HTMLDivElement | null>(null)
  const buttonIconRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const setButtonIconRefs =
    (id: string) => (element: HTMLButtonElement | null) => {
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
        toolbarActions.updateToolbar({
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

        const newState: Partial<Record<CardtextToolbarKey, IconState>> = {
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

        if (isTextAlignKey(key)) {
          dispatch(
            cardtextActions.updateCardtext({
              ...storeCardtext,
              textAlign: key,
            })
          )
        }
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
    const heightEditor = editorRef.current?.offsetHeight ?? 0
    const baseSizeLineHeight = Math.floor((heightEditor / lines) * 10) / 10
    const baseFontSize = Math.floor((baseSizeLineHeight / 1.33) * 10) / 10

    dispatch(
      cardtextActions.updateCardtext({
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
    setButtonIconRefs,
    markPath,
    setMarkPath,
  }
}
