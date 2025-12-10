import React from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { useCardEditorController } from '@features/cardtext/application/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { renderLeaf } from '../renderLeaf'
import { useEditorLayout } from '../../application/hooks'
import { DEFAULT_CARDTEXT_LINES } from '../../domain/types'
import styles from './CardEditor.module.scss'

export const CardEditor: React.FC = () => {
  const {
    state: stateCardEditorController,
    actions: actionsCardEditorController,
  } = useCardEditorController()
  const { editor, value, editorRef, editableRef } = stateCardEditorController
  const { handleSlateChange } = actionsCardEditorController

  const handleClickEditorArea = () => {
    editableRef.current?.focus()
    ReactEditor.focus(editor)
  }

  const { lineHeight, fontSize } = useEditorLayout(
    editorRef,
    DEFAULT_CARDTEXT_LINES
  )

  return (
    <div className={styles.editor}>
      <Toolbar section="cardtext" />

      <div
        className={styles.editorArea}
        ref={editorRef}
        onClick={handleClickEditorArea}
      >
        <Slate
          editor={editor}
          initialValue={value}
          onChange={handleSlateChange}
        >
          <Editable
            className={styles.editorEditable}
            ref={editableRef}
            style={{
              lineHeight: `${lineHeight}px`,
              fontSize: `${fontSize}px`,
            }}
            placeholder="Hi..."
            renderLeaf={renderLeaf}
          />
        </Slate>
      </div>
    </div>
  )
}
