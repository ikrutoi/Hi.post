// import { useEffect } from 'react'
// import { useEditorSetup } from '@cardtext/infrastructure/slate/useEditorSetup'
// import { useCardtextStore } from '@cardtext/application/hooks'
// import { useCardtextBehavior } from '@cardtext/application/logic'
// import { useLayoutFacade } from '@layout/application/facades'
// import { useLayoutNavFacade } from '@layoutNav/application/facades'
// import { useToolbarFacade } from '@toolbar/application/facades'
// import { useCardtextFacade } from '../facades'
// // import { useCardtextController } from '../controllers'
// import type { CardtextBlock } from '../../domain/types'

// export const useCardEditorController = () => {
//   const editor = useEditorSetup()

//   const {
//     value,
//     setValue,
//     cardtextToolbar,
//     handleClickButton,
//     handleClickButtonMain,
//     handleSlateChange,
//     editorRef,
//     editableRef,
//     buttonColor,
//     setButtonColor,
//     buttonIconRefs,
//     setButtonIconRefs,
//     markPath,
//     setMarkPath,
//   } = useCardtextBehavior(editor)

//   const { loadFromTemplate, saveToTemplate, getTemplateStats } =
//     useCardtextStore()

//   const { cardtext, updateCardtext, setCardtext } = useCardtextFacade()

//   const { state: stateLayoutNavFacade } = useLayoutNavFacade()
//   const { selectedCardMenuSection } = stateLayoutNavFacade

//   const { size } = useLayoutFacade()
//   const { remSize } = size

//   const { state, actions: toolbarActions } = useToolbarFacade('cardtext')

//   useEffect(() => {
//     if (selectedCardMenuSection === 'cardtext') {
//       loadFromTemplate(selectedCardMenuSection).then((nodes) => {
//         if (nodes) setValue(nodes)
//       })
//     }
//   }, [selectedCardMenuSection])

//   useEffect(() => {
//     setCardtext(value)

//     const hasText = value.some((block: CardtextBlock) =>
//       block.children.some((child) => child.text.trim().length > 0)
//     )
//     const isHasText = hasText ? 'enabled' : 'disabled'

//     toolbarActions.updateCurrent({ save: isHasText, remove: isHasText })

//     // getTemplateStats().then(({ count }) => {
//     //   toolbarActions.updateCurrent({ savedTemplatesCount: count })
//     // })
//   }, [value])

//   // useEffect(() => {
//   //   templateSectionsState.cardtext === 'active'
//   //     ? setUiSelectedTemplateSection('cardtext')
//   //     : setUiSelectedTemplateSection(null)
//   // }, [templateSectionsState.cardtext])

//   // useEffect(() => {
//   //   infoButtonsState.cardtext.clip === 'hover'
//   //     ? setChoiceClip('cardtext')
//   //     : setChoiceClip(false)
//   // }, [infoButtonsState.cardtext.clip])

//   // useEditorMarkers({
//   //   editor,
//   //   editorRef,
//   //   editableRef,
//   //   markRef,
//   //   markPath,
//   //   setMarkPath,
//   //   calcStyleAndLinesEditable,
//   // })

//   const handleClickColor = (colorName: string, colorType: string) => {
//     updateCardtext({ colorName, colorType })
//     setButtonColor(false)
//   }

//   return {
//     editor,
//     value,
//     setValue,
//     handleSlateChange,
//     handleClickButton,
//     handleClickButtonMain,
//     handleClickColor,
//     editorRef,
//     editableRef,
//     buttonColor,
//     setButtonColor,
//     cardtextToolbar,
//     buttonIconRefs,
//     setButtonIconRefs,
//     toolbarCardtext: state,
//     // infoBtnsCardtext: infoButtonsState.cardtext,
//     // styleLeftCardPuzzle,
//     cardEditCardtext: cardtext,
//     remSize,
//     saveToTemplate,
//   }
// }
