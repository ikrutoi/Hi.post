import React, { useMemo } from 'react'
import clsx from 'clsx'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { STEP_TO_PX } from '../../domain/types'
import type { CardtextValue, CardtextStyle } from '../../domain/types'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
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
  title?: string
  onTitleClick?: () => void
  titleOverflows?: boolean
  titleRef?: React.RefObject<HTMLSpanElement | null>
}

export const CardtextView: React.FC<Props> = ({
  value,
  style,
  contentKey,
  title,
  onTitleClick,
  titleOverflows,
  titleRef,
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
      className={clsx(styles.viewContainer, colorClass)}
      style={{
        fontSize: `${currentPxSize}px`,
        lineHeight: `${lineHeight}px`,
        textAlign: style?.align ?? 'left',
      }}
    >
      {title?.trim() && onTitleClick && (
        <button
          type="button"
          className={styles.viewTitle}
          onClick={onTitleClick}
          aria-label="Change template name"
          title="Change template name"
        >
          <span
            ref={titleRef}
            className={
              titleOverflows
                ? `${styles.viewTitleText} ${styles.viewTitleTextFade}`
                : styles.viewTitleText
            }
            aria-hidden
          >
            {title}
          </span>
        </button>
      )}
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          readOnly
          renderLeaf={renderLeaf}
          renderElement={renderElement}
          className={styles.viewEditable}
        />
      </Slate>
    </div>
  )
}
