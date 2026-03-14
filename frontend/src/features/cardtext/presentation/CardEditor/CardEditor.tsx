import React, { useEffect, useMemo, useState } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { Editor, Transforms, Range, Descendant } from 'slate'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardtextFacade } from '../../application/facades'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { useInitSelection } from '../../application/hooks'
import { STEP_TO_PX } from '../../domain/types'
import { selectCardtextFocusRequested } from '../../infrastructure/selectors'
import { setCardtextFocusRequested } from '../../infrastructure/state'
import { IconSectionMenuCardtext } from '@shared/ui/icons'
import styles from './CardEditor.module.scss'
import type { CardtextValue } from '../../domain/types'

function isEmptyValue(value: CardtextValue): boolean {
  if (!value?.length) return true
  if (value.length > 1) return false
  const block = value[0]
  const text = block?.children?.map((c) => (c as { text?: string }).text).join('') ?? ''
  return text.trim() === ''
}

export const CardEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const requestFocus = useAppSelector(selectCardtextFocusRequested)
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
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!requestFocus) return
    const id = setTimeout(() => {
      const el = editableRef.current
      if (!el) return
      el.focus()
      const end = Editor.end(editor, [])
      if (end) Transforms.select(editor, { anchor: end, focus: end })
      ReactEditor.focus(editor)
      setIsFocused(true)
      dispatch(setCardtextFocusRequested(false))
    }, 0)
    return () => clearTimeout(id)
  }, [requestFocus, dispatch, editor])

  const handleClickEditorArea = () => {
    if (!editableRef.current) return
    editableRef.current.focus()

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

  const isEmpty = useMemo(() => isEmptyValue(value), [value])

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
        {isEmpty && !isFocused && (
          <div className={styles.editorPlaceholderIcon} aria-hidden>
            <IconSectionMenuCardtext />
          </div>
        )}
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
            placeholder=""
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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
