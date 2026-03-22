import React, { useEffect, useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
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
import { isEmptyCardtextValue } from '../../domain/helpers'
import styles from './CardEditor.module.scss'
import type { CardtextValue } from '../../domain/types'

export const CardEditor: React.FC = () => {
  const dispatch = useAppDispatch()
  const requestFocus = useAppSelector(selectCardtextFocusRequested)
  const {
    fontSizeStep,
    editor,
    style,
    value,
    editorRef,
    editableRef,
    resetToken,
    setValue,
    decreaseFontSize,
  } = useCardtextFacade()

  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] || 16
  const currentLineHeight = Math.round(currentPxSize * 1.5)

  const defaultTextColorMap: Record<string, string> = {
    deepBlack: '#1a1a1b',
    blue: '#1e3a8a',
    burgundy: '#741b47',
    forestGreen: '#064e3b',
  }
  const defaultTextColor =
    defaultTextColorMap[style.color as string] ?? defaultTextColorMap.deepBlack

  useInitSelection(editor)

  const lastSelectionRef = React.useRef<any>(null)
  const [isFocused, setIsFocused] = useState(false)

  const isEmpty = useMemo(() => isEmptyCardtextValue(value), [value])

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

  const renderLeafWithColor = useCallback(
    (leafProps: { attributes: any; children: React.ReactNode; leaf: any }) => {
      const { attributes, children, leaf } = leafProps
      let spanStyle: React.CSSProperties = {}

      // if (leaf.italic) spanStyle.fontStyle = 'italic'
      // if (leaf.bold) spanStyle.fontWeight = 'bold'
      // if (leaf.underline) spanStyle.textDecoration = 'underline'
      spanStyle.color = leaf.color || defaultTextColor
      if (leaf.fontSize) spanStyle.fontSize = `${leaf.fontSize}px`

      return (
        <span {...attributes} style={spanStyle}>
          {children}
        </span>
      )
    },
    [defaultTextColor],
  )

  return (
    <div className={styles.editor}>
      {isEmpty ? (
        <div
          className={clsx(
            styles.editorPlaceholderIcon,
            isFocused && styles.editorPlaceholderIconHidden,
          )}
          aria-hidden
        >
          <IconSectionMenuCardtext />
        </div>
      ) : null}
      {/* <button
        type="button"
        className={styles.closeBtn}
        onClick={() => {
          dispatch(setCardtextFocusRequested(false))
          setCurrentView('cardtextView')
        }}
        aria-label="Close text editor"
      >
        <IconX />
      </button> */}
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
            placeholder=""
            renderLeaf={renderLeafWithColor}
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
