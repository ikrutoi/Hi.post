import React, { useEffect, useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { Editor, Transforms, Range, Descendant } from 'slate'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardtextFacade } from '../../application/facades'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { useInitSelection } from '../../application/hooks'
import { STEP_TO_PX } from '../../domain/types'
import { selectIsDraftFocus } from '../../infrastructure/selectors'
import {
  setDraftFocus,
  setDraftEngaged,
  resetCardtextAssetToEmptyDraft,
  setCardtextViewEditMode,
  setStatus,
} from '../../infrastructure/state'
import { IconSectionMenuCardtext } from '@shared/ui/icons'
import { IconX } from '@shared/ui/icons'
import { isEmptyCardtextValue } from '../../domain/helpers'
import styles from './CardEditor.module.scss'
import viewStyles from '../CardtextView/CardtextView.module.scss'
import type { CardtextValue } from '../../domain/types'

type CardEditorProps = {
  /** Tighter top padding when the floating title strip is in edit mode (e.g. save template) */
  titleStripEditing?: boolean
}

export const CardEditor: React.FC<CardEditorProps> = ({
  titleStripEditing,
}) => {
  const dispatch = useAppDispatch()
  const requestFocus = useAppSelector(selectIsDraftFocus)
  const cardtextAssetData = useAppSelector((s) => s.cardtext.assetData)
  const cardtextPresetData = useAppSelector((s) => s.cardtext.presetData)
  const isDraftEngaged = useAppSelector((s) => s.cardtext.isDraftEngaged)
  const {
    fontSizeStep,
    editor,
    style,
    value,
    editorRef,
    editableRef,
    resetToken,
    setValue,
    setCurrentView,
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

  const isEmpty = useMemo(() => isEmptyCardtextValue(value), [value])
  /** Placeholder only before the user engages the empty create surface (click / cardtextAdd). */
  const showEmptyPlaceholder = isEmpty && !isDraftEngaged

  useEffect(() => {
    if (!requestFocus) return
    const id = setTimeout(() => {
      const el = editableRef.current
      if (!el) return
      el.focus()
      const end = Editor.end(editor, [])
      if (end) Transforms.select(editor, { anchor: end, focus: end })
      ReactEditor.focus(editor)
      dispatch(setDraftFocus(false))
    }, 0)
    return () => clearTimeout(id)
  }, [requestFocus, dispatch, editor])

  const handleClickEditorArea = () => {
    if (cardtextAssetData == null) {
      dispatch(setDraftEngaged(true))
      dispatch(setDraftFocus(true))
    }
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
    if (cardtextAssetData == null) return
    const container = editorRef.current
    if (!container) return

    const isOverflown = container.scrollHeight > container.clientHeight

    if (isOverflown && fontSizeStep > 1) {
      decreaseFontSize()
    }
  }, [
    value,
    fontSizeStep,
    decreaseFontSize,
    editorRef,
    cardtextAssetData,
  ])

  const handleEditorClose = useCallback(() => {
    dispatch(setDraftFocus(false))
    if (cardtextAssetData == null) {
      dispatch(setDraftEngaged(false))
      return
    }
    if (
      cardtextPresetData == null &&
      cardtextAssetData.status === 'draft'
    ) {
      dispatch(resetCardtextAssetToEmptyDraft())
      return
    }
    // Редактирование с открытки: сбрасываем флаг, иначе selectCardtextSource остаётся draft и тулбар cardtextCreate.
    dispatch(setCardtextViewEditMode(false))
    const st = cardtextAssetData.status
    if (st === 'inLine' || st === 'outLine') {
      dispatch(setStatus(st))
    } else {
      setCurrentView('view')
    }
  }, [
    cardtextAssetData,
    cardtextPresetData,
    dispatch,
    setCurrentView,
  ])

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
    <div
      className={clsx(
        styles.editor,
        titleStripEditing && styles.editorTitleStripEditing,
      )}
    >
      {showEmptyPlaceholder ? (
        <div
          className={styles.editorPlaceholderIcon}
          aria-hidden
          role="presentation"
          onClick={(e) => {
            e.stopPropagation()
            handleClickEditorArea()
          }}
        >
          <IconSectionMenuCardtext />
        </div>
      ) : null}
      {(cardtextAssetData != null || isDraftEngaged) ? (
        <button
          type="button"
          className={viewStyles.viewCloseBtn}
          onClick={handleEditorClose}
          aria-label="Close text editor"
          title={
            cardtextAssetData == null ? 'Close' : 'Back to text view'
          }
        >
          <IconX />
        </button>
      ) : null}
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
            const next = newValue as CardtextValue
            // Пока нет сессии и пользователь не «вовлёк» редактор — не пишем в Redux
            // (Slate даёт onChange при маунте/нормализации → иначе ensureAsset создаёт пустой assetData).
            if (cardtextAssetData == null && !isDraftEngaged) {
              return
            }
            if (
              cardtextAssetData == null &&
              isEmptyCardtextValue(next)
            ) {
              return
            }
            setValue(next)
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
            onFocus={() => {
              if (cardtextAssetData == null) {
                dispatch(setDraftEngaged(true))
                dispatch(setDraftFocus(true))
              }
            }}
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
