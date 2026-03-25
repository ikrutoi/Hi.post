import React from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCardtextStyle } from '@cardtext/infrastructure/selectors'
import { setTextStyle } from '@cardtext/infrastructure/state'
import type { TextColor } from '@/features/cardtext/domain/editor/editor.types'
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

const OPTIONS: TextColor[] = ['deepBlack', 'blue', 'burgundy', 'forestGreen']

export const CardtextColorButton: React.FC<CardtextColorButtonProps> = ({
  className,
  disabled,
}) => {
  const dispatch = useAppDispatch()
  const { color } = useAppSelector(selectCardtextStyle)
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setOpen((prev) => !prev)
  }

  const handleSelect = (value: TextColor) => {
    dispatch(setTextStyle({ color: value }))
    setOpen(false)
  }

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const active = COLOR_HEX[color] ?? COLOR_HEX.blue

  return (
    <div className={styles.toolbarColorWrapper} ref={containerRef}>
      <button
        type="button"
        className={className}
        data-icon-key="colorPicker"
        data-icon-state={disabled ? 'disabled' : 'enabled'}
        disabled={disabled}
        onClick={handleToggle}
      >
        <IconColor className={styles.toolbarIcon} style={{ color: active }} />
      </button>
      {open && (
        <div className={styles.toolbarColorMenu}>
          {OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              className={clsx(
                styles.toolbarColorMenuItem,
                value === color && styles.toolbarColorMenuItemActive,
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(value)
              }}
              aria-label={`Set text color ${value}`}
            >
              <IconColor
                className={styles.toolbarIcon}
                style={{ color: COLOR_HEX[value] }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
