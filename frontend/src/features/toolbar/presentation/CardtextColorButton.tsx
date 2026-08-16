import React from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCardtextStyle } from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import { TEXT_COLOR, type TextColor } from '@cardtext/domain/types'
import { IconColor } from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

interface CardtextColorButtonProps {
  className: string
  disabled: boolean
}

const COLOR_HEX: Record<TextColor, string> = {
  deepBlack: '#1a1a1b',
  blue: '#1e3a8a',
  burgundy: '#741b47',
  forestGreen: '#064e3b',
}

function nextTextColor(current: TextColor): TextColor {
  const index = TEXT_COLOR.indexOf(current)
  const safeIndex = index < 0 ? 0 : index
  return TEXT_COLOR[(safeIndex + 1) % TEXT_COLOR.length]
}

export const CardtextColorButton: React.FC<CardtextColorButtonProps> = ({
  className,
  disabled,
}) => {
  const dispatch = useAppDispatch()
  const { color } = useAppSelector(selectCardtextStyle)
  const active = COLOR_HEX[color] ?? COLOR_HEX.deepBlack

  const handleCycle = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    dispatch(setTextStyle({ color: nextTextColor(color) }))
  }

  return (
    <button
      type="button"
      className={className}
      data-icon-key="colorPicker"
      data-icon-state={disabled ? 'disabled' : 'enabled'}
      disabled={disabled}
      aria-label="Cycle text color"
      title="Cycle text color"
      onPointerDown={handleCycle}
    >
      <IconColor className={styles.toolbarIcon} style={{ color: active }} />
    </button>
  )
}
