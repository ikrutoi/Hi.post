import React from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { Editor, Transforms, Range, Descendant } from 'slate'
import { useAppDispatch } from '@app/hooks'
import { useCardtextFacade } from '../../application/facades'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { useEditorLayout } from '../../application/hooks'
import { useForceUpdateCardtextToolbar } from '../../application/commands'
import styles from './CardEditor.module.scss'
import type { CardtextValue } from '../../domain/types'

export const CardEditor: React.FC = () => {
  const { state: stateCardtext, actions: actionsCardtext } = useCardtextFacade()
  const { editor, value, editorRef, editableRef } = stateCardtext
  const { setValue } = actionsCardtext

  const dispatch = useAppDispatch()
  const lastSelectionRef = React.useRef<any>(null)

  const handleClickEditorArea = () => {
    editableRef.current?.focus()

    if (lastSelectionRef.current) {
      Transforms.select(editor, lastSelectionRef.current)
      ReactEditor.focus(editor)
    } else {
      const end = Editor.end(editor, [])
      if (end) {
        Transforms.select(editor, { anchor: end, focus: end })
        ReactEditor.focus(editor)
      }
    }
  }

  const { forceUpdateToolbar } = useForceUpdateCardtextToolbar(editor)

  const { lineHeight, fontSize } = useEditorLayout(editorRef)

  return (
    <div className={styles.editor}>
      <div
        className={styles.editorArea}
        ref={editorRef}
        onClick={handleClickEditorArea}
        onBlur={() => {
          if (editor.selection) {
            if (Range.isCollapsed(editor.selection)) {
              lastSelectionRef.current = editor.selection
            } else {
              const { focus } = editor.selection
              lastSelectionRef.current = { anchor: focus, focus }
            }
          }
        }}
        onFocus={() => {
          if (lastSelectionRef.current) {
            Transforms.select(editor, lastSelectionRef.current)
            ReactEditor.focus(editor)
          }
        }}
        tabIndex={0}
      >
        <Slate
          editor={editor}
          initialValue={value as Descendant[]}
          onChange={(newValue: Descendant[]) => {
            setValue(newValue as CardtextValue)
          }}
        >
          <Toolbar section="cardtext" editor={editor} dispatch={dispatch} />

          <Editable
            className={styles.editorEditable}
            ref={editableRef}
            style={{
              lineHeight: `${lineHeight}px`,
              fontSize: `${fontSize}px`,
            }}
            placeholder="Hi..."
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onSelect={() => {
              if (editor.selection) {
                lastSelectionRef.current = editor.selection
              }
            }}
            // onSelect={forceUpdateToolbar}
            onKeyUp={forceUpdateToolbar}
            onMouseUp={forceUpdateToolbar}
          />
        </Slate>
      </div>
    </div>
  )
}
