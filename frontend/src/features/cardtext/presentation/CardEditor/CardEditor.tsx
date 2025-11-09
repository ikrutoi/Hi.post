import React from 'react'
import { Slate, Editable } from 'slate-react'
import { useCardEditorController } from '@features/cardtext/application/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import styles from './CardEditor.module.scss'

interface CardEditorProps {
  styleLeft: number
}

export const CardEditor: React.FC<CardEditorProps> = ({ styleLeft }) => {
  const {
    editor,
    value,
    setValue,
    handleSlateChange,
    handleClickButton,
    handleClickButtonMain,
    handleClickColor,
    editorRef,
    editableRef,
    buttonColor,
    setButtonColor,
    cardtextToolbar,
    buttonIconRefs,
    setButtonIconRefs,
    // infoButtonsCardtext,
    // styleLeftCardPuzzle,
    cardEditCardtext,
    remSize,
    saveToTemplate,
    // listBtnsCardtext,
    // listBtnsCardtextMain,
  } = useCardEditorController()

  return (
    <div className={styles.editor}>
      <Toolbar
        section="cardtext"
        // listBtns={listBtnsCardtext}
        // listBtnsMain={listBtnsCardtextMain}
        // buttonColor={buttonColor}
        // remSize={remSize}
        // setButtonColor={setButtonColor}
        // infoButtonsCardtext={infoButtonsCardtext}
        // onSelectColor={handleClickColor}
        // styleLeftCardPuzzle={styleLeftCardPuzzle}
        // buttonIconRefs={buttonIconRefs}
        // setButtonIconRefs={setButtonIconRefs}
        // handleClickButton={handleClickButton}
        // handleClickButtonMain={handleClickButtonMain}
        // cardtextToolbar={cardtextToolbar}
      />

      <div className={styles['editor__area']} ref={editorRef}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleSlateChange}
        >
          <Editable
            className={styles['editor__editable']}
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
