import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { STEP_TO_PX } from '../../domain/types'
import type { CardtextValue, CardtextStyle } from '../../domain/types'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { IconX } from '@shared/ui/icons'
import styles from './CardtextView.module.scss'

const COLOR_CLASS_MAP: Record<string, keyof typeof styles> = {
  deepBlack: 'colorDeepBlack',
  blue: 'colorBlue',
  burgundy: 'colorBurgundy',
  forestGreen: 'colorForestGreen',
}

type Props = {
  value: CardtextValue
  style: CardtextStyle
  contentKey?: string
  /** Tighter top padding when the floating title strip is in edit mode */
  titleStripEditing?: boolean
  /** Same control as CardEditor close — e.g. switch to draft editor */
  onClose?: () => void
}

export const CardtextView: React.FC<Props> = ({
  value,
  style,
  contentKey,
  titleStripEditing,
  onClose,
}) => {
  const slateKey =
    contentKey ??
    (value?.length
      ? String(value.length) + (value[0]?.children?.[0]?.text ?? '')
      : 'empty')
  const editor = useMemo(() => withReact(createEditor()), [slateKey])

  const fontSizeStep = style?.fontSizeStep ?? 3
  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] ?? 16
  const lineHeight = Math.round(currentPxSize * 1.5)
  const colorKey = style?.color ?? 'deepBlack'
  const colorClass = styles[COLOR_CLASS_MAP[colorKey] ?? 'colorDeepBlack']
  const initialValue = (
    value?.length
      ? value
      : [{ type: 'paragraph', align: 'left', children: [{ text: '' }] }]
  ) as Descendant[]

  return (
    <div
      className={clsx(
        styles.viewContainer,
        titleStripEditing && styles.viewContainerTitleStripEditing,
        colorClass,
      )}
      style={{
        fontSize: `${currentPxSize}px`,
        lineHeight: `${lineHeight}px`,
        textAlign: style?.align ?? 'left',
      }}
    >
      {onClose ? (
        <button
          type="button"
          className={styles.viewCloseBtn}
          onClick={onClose}
          aria-label="Close text view"
          title="Edit text"
        >
          <IconX />
        </button>
      ) : null}
      <div className={styles.viewBody}>
        <Slate editor={editor} initialValue={initialValue}>
          <Editable
            readOnly
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            className={styles.viewEditable}
          />
        </Slate>
      </div>
    </div>
  )
}
