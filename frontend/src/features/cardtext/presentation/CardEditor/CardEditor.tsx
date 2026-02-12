import React, { useEffect } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { Editor, Transforms, Range, Descendant } from 'slate'
import { useCardtextFacade } from '../../application/facades'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { useInitSelection } from '../../application/hooks'
// import { useForceUpdateCardtextToolbar } from '../../application/commands'
import { STEP_TO_PX } from '../../domain/types'
import styles from './CardEditor.module.scss'
import type { CardtextValue } from '../../domain/types'

export const CardEditor: React.FC = () => {
  const {
    fontSizeStep,
    editor,
    value,
    editorRef,
    editableRef,
    resetToken,
    setValue,
    decreaseFontSize,
  } = useCardtextFacade()

  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] || 16
  const currentLineHeight = Math.round(currentPxSize * 1.5)

  useInitSelection(editor)

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

  useEffect(() => {
    const container = editorRef.current
    if (!container) return

    const isOverflown = container.scrollHeight > container.clientHeight

    if (isOverflown && fontSizeStep > 1) {
      decreaseFontSize()
    }
  }, [value, fontSizeStep, decreaseFontSize, editorRef])

  // const { forceUpdateToolbar } = useForceUpdateCardtextToolbar(editor)

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
          key={resetToken}
          editor={editor}
          initialValue={value as Descendant[]}
          onChange={(newValue: Descendant[]) => {
            setValue(newValue as CardtextValue)
            // forceUpdateToolbar()
          }}
        >
          <Editable
            className={styles.editorEditable}
            ref={editableRef}
            style={{
              lineHeight: `${currentLineHeight}px`,
              fontSize: `${currentPxSize}px`,
            }}
            placeholder="Hi..."
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onSelect={() => {
              if (editor.selection) {
                lastSelectionRef.current = editor.selection
              }
            }}
          />
        </Slate>
      </div>
    </div>
  )
}
