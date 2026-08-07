import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { STEP_TO_PX, clampCardtextFontSizeStep } from '../../domain/types'
import type { CardtextValue, CardtextStyle } from '../../domain/types'
import { renderLeaf } from '../renderLeaf'
import { renderElement } from '../renderElement'
import { getToolbarIcon } from '@shared/utils/icons'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useAppDispatch } from '@app/hooks'
import { toolbarAction } from '@toolbar/application/helpers'
import { pulseListCardtextBadge } from '@cardtext/infrastructure/state'
import { TemplateFavoriteToggle } from '@shared/ui/TemplateFavoriteToggle/TemplateFavoriteToggle'
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
  onDelete?: () => void
  /** Archive peek: стандартный кадр секции (как cardphoto viewContainer). */
  sectionFrame?: boolean
  /** View: template in quick list — yellow star when true. */
  templateInQuickList?: boolean
  /** Show add/remove-templates star (View, not applied peek). */
  showFavoriteToggle?: boolean
}

export const CardtextView: React.FC<Props> = ({
  value,
  style,
  contentKey,
  titleStripEditing,
  onDelete,
  sectionFrame = false,
  templateInQuickList = false,
  showFavoriteToggle = false,
}) => {
  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const slateKey =
    contentKey ??
    (value?.length
      ? String(value.length) + (value[0]?.children?.[0]?.text ?? '')
      : 'empty')
  const editor = useMemo(() => withReact(createEditor()), [slateKey])

  const fontSizeStep = clampCardtextFontSizeStep(style?.fontSizeStep ?? 3)
  const currentPxSize = STEP_TO_PX[fontSizeStep - 1] ?? STEP_TO_PX[0]
  const lineHeight = Math.round(currentPxSize * 1.5)
  const colorKey = style?.color ?? 'deepBlack'
  const colorClass = styles[COLOR_CLASS_MAP[colorKey] ?? 'colorDeepBlack']
  const initialValue = (
    value?.length
      ? value
      : [{ type: 'paragraph', align: 'left', children: [{ text: '' }] }]
  ) as Descendant[]
  const showDelete = Boolean(onDelete) && !isMobileLayout

  const handleFavoriteToggle = useCallback(() => {
    dispatch(pulseListCardtextBadge())
    dispatch(
      toolbarAction({
        section: 'cardtextView',
        key: templateInQuickList ? 'removeFromList' : 'addList',
      }),
    )
  }, [dispatch, templateInQuickList])

  return (
    <div
      className={clsx(
        styles.viewContainer,
        titleStripEditing && styles.viewContainerTitleStripEditing,
        sectionFrame && styles.viewContainerSectionFrame,
        colorClass,
      )}
      style={{
        fontSize: `${currentPxSize}px`,
        lineHeight: `${lineHeight}px`,
        textAlign: style?.align ?? 'left',
      }}
    >
      <div
        className={clsx(
          styles.viewBody,
          sectionFrame && styles.viewBodySectionFrame,
        )}
      >
        {/** `initialValue` только при mount — без key Slate не подхватывает смену строки/данных при том же editor memo. */}
        <Slate key={slateKey} editor={editor} initialValue={initialValue}>
          <Editable
            readOnly
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            className={styles.viewEditable}
          />
        </Slate>
      </div>
      {showFavoriteToggle ? (
        <TemplateFavoriteToggle
          active={templateInQuickList}
          corner="top-right"
          onToggle={handleFavoriteToggle}
        />
      ) : null}
      {showDelete ? (
        <div className={styles.viewOverlayActions}>
          <button
            type="button"
            className={styles.viewDeleteBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.()
            }}
            aria-label="Delete text template"
            title="Delete template"
          >
            {getToolbarIcon({ key: 'delete' })}
          </button>
        </div>
      ) : null}
    </div>
  )
}
