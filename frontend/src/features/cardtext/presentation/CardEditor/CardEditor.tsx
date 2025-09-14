import React from 'react'
import { Slate, Editable } from 'slate-react'
import { useCardEditorController } from '@features/cardtext/application/controllers/useCardEditorController'
import { Toolbar } from '@features/cardtext/toolbar/presentation/Toolbar.view'
import styles from './CardEditor.module.scss'

export const CardEditor: React.FC = () => {
  const {
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
    infoButtonsCardtext,
    styleLeftCardPuzzle,
    cardEditCardtext,
    remSize,
    saveToMemory,
    listBtnsCardtext,
    listBtnsCardtextMain,
  } = useCardEditorController()

  return (
    <div className={styles.editor}>
      <Toolbar
        listBtns={listBtnsCardtext}
        listBtnsMain={listBtnsCardtextMain}
        btnColor={btnColor}
        remSize={remSize}
        setBtnColor={setBtnColor}
        infoButtonsCardtext={infoButtonsCardtext}
        onSelectColor={handleClickColor}
        styleLeftCardPuzzle={styleLeftCardPuzzle}
        btnIconRefs={btnIconRefs}
        setBtnIconRefs={setBtnIconRefs}
        handleClickBtn={handleClickBtn}
        handleClickBtnMain={handleClickBtnMain}
        btnsCardtext={btnsCardtext}
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
