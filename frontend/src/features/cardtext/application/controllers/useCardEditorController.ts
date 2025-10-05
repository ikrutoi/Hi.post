import { useEffect } from 'react'
import { useAppDispatch } from '@app/hooks'
import { useEditorSetup } from '@cardtext/infrastructure/slate/useEditorSetup'
import { useCardtext } from '@/features/cardtext/application/hooks/useCardtext'
import { useCardtextBehavior } from '@cardtext/application/logic/useCardtext.behavior'
import { useEditorMarkers } from '@cardtext/application/logic/useEditorMarkers'
import { useCardtext } from '@/features/cardtext/application/hooks/useCardtext'
import { useInfoButtons } from '@features/infobuttons/infrastructure/useInfoButtons'
import { useLayoutFacade } from '@layout/application/facades/useLayoutFasade'
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

  const { loadFromMemory, saveToMemory, getMemoryStats } = useCardtext(editor)

  const { cardtextState, updateCardtextState } = useCardtext()
  const { infoButtonsState, updateInfoButtonsState } = useInfoButtons()

  const {
    size,
    memory,
    section,
    // editor,
    // editor,
    // choiceMemorySection,
    // layoutActiveSections,
    // styleLeftCardPuzzle,
    // remSize,
    // setChoiceClip,
    // setActiveSections,
  } = useLayoutFacade()

  const { remSize } = size
  const { choiceMemorySection, activeSection } = section

  useEffect(() => {
    if (choiceMemorySection.section === 'cardtext') {
      loadFromMemory(choiceMemorySection.id).then((nodes) => {
        if (nodes) setValue(nodes)
      })
    }
  }, [choiceMemorySection])

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

    // setActiveSections({
    //   ...activeSection,
    //   cardtext: hasText,
    // })

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
