import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { useEditorSetup } from '@features/cardtext/infrastructure/slate/useEditorSetup'
import { useCardtextStorage } from '@features/cardtext/infrastructure/indexDb/useCardtextStorage'
import { useCardtextBehavior } from '@features/cardtext/application/logic/useCardtextBehavior'
import { useEditorMarkers } from '@features/cardtext/application/logic/useEditorMarkers'
import { useCardtext } from '@features/cardtext/infrastructure/useCardtext'
import { useInfoButtons } from '@features/infobuttons/infrastructure/useInfoButtons'
import { useLayout } from '@features/layout/infrastructure/useLayout'
import { addCardtext } from '@features/cardedit/application/state/cardEditSlice'

export const useCardEditorController = () => {
  const dispatch = useAppDispatch()
  const editor = useEditorSetup()

  const {
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
    markRef,
    calcStyleAndLinesEditable,
  } = useCardtextBehavior(editor)

  const { loadFromMemory, saveToMemory, getMemoryStats } =
    useCardtextStorage(editor)

  const { cardtextState, updateCardtextState } = useCardtext()
  const { infoButtonsState, updateInfoButtonsState } = useInfoButtons()
  const {
    memorySection,
    layoutActiveSections,
    styleLeftCardPuzzle,
    remSize,
    setChoiceClip,
    setActiveSections,
  } = useLayout()

  useEffect(() => {
    if (memorySection.section === 'cardtext') {
      loadFromMemory(memorySection.id).then((nodes) => {
        if (nodes) setValue(nodes)
      })
    }
  }, [memorySection])

  useEffect(() => {
    dispatch(addCardtext({ text: value }))

    const hasText = value?.[0]?.children?.[0]?.text?.length > 0

    updateInfoButtonsState({
      cardtext: {
        ...infoButtonsState.cardtext,
        save: hasText,
        delete: hasText,
      },
    })

    setActiveSections({
      ...layoutActiveSections,
      cardtext: hasText,
    })

    getMemoryStats().then(({ count }) => {
      updateInfoButtonsState({
        cardtext: {
          ...infoButtonsState.cardtext,
          clip: count,
        },
      })
    })
  }, [value])

  useEffect(() => {
    infoButtonsState.cardtext.clip === 'hover'
      ? setChoiceClip('cardtext')
      : setChoiceClip(false)
  }, [infoButtonsState.cardtext.clip])

  useEditorMarkers({
    editor,
    editorRef,
    editableRef,
    markRef,
    markPath,
    setMarkPath,
    calcStyleAndLinesEditable,
  })

  const handleClickColor = (colorName: string, colorType: string) => {
    updateCardtextState({ colorName, colorType })
    setBtnColor(false)
  }

  return {
    editor,
    value,
    setValue,
    handleSlateChange,
    handleClickBtn,
    handleClickBtnMain,
    handleClickColor,
    editorRef,
    editableRef,
    btnColor,
    setBtnColor,
    btnsCardtext,
    btnIconRefs,
    setBtnIconRefs,
    infoBtnsCardtext: infoButtonsState.cardtext,
    styleLeftCardPuzzle,
    cardEditCardtext: cardtextState,
    remSize,
    saveToMemory,
  }
}
