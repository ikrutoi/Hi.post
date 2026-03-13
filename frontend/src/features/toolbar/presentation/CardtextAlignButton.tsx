import React from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCardtextStyle } from '@cardtext/infrastructure/selectors'
import { setAlign, setTextStyle } from '@cardtext/infrastructure/state'
import type { TextAlign } from '@cardtext/domain/types'
import {
  IconAlignLeftV3,
  IconAlignCenterV3,
  IconAlignRightV3,
  IconAlignJustifyV3,
} from '@shared/ui/icons'
import styles from './Toolbar.module.scss'

interface CardtextAlignButtonProps {
  className: string
  disabled: boolean
}

const OPTIONS: { value: TextAlign; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
  { value: 'left', Icon: IconAlignLeftV3 },
  { value: 'center', Icon: IconAlignCenterV3 },
  { value: 'right', Icon: IconAlignRightV3 },
  { value: 'justify', Icon: IconAlignJustifyV3 },
]

export const CardtextAlignButton: React.FC<CardtextAlignButtonProps> = ({
  className,
  disabled,
}) => {
  const dispatch = useAppDispatch()
  const { align } = useAppSelector(selectCardtextStyle)
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (disabled) return
    setOpen((prev) => !prev)
  }

  const handleSelect = (value: TextAlign) => {
    // Обновляем выравнивание существующего текста и стили по умолчанию.
    dispatch(setAlign(value))
    dispatch(setTextStyle({ align: value }))
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

  const active = OPTIONS.find((o) => o.value === align) ?? OPTIONS[0]
  const ActiveIcon = active.Icon

  return (
    <div className={styles.toolbarAlignWrapper} ref={containerRef}>
      <button
        type="button"
        className={className}
        data-icon-key="left"
        data-icon-state={disabled ? 'disabled' : 'enabled'}
        disabled={disabled}
        onMouseDown={handleToggle}
      >
        <ActiveIcon className={styles.toolbarIcon} />
      </button>
      {open && (
        <div className={styles.toolbarAlignMenu}>
          {OPTIONS.map(({ value, Icon }) => (
            <button
              key={value}
              type="button"
              className={clsx(
                styles.toolbarAlignMenuItem,
                value === align && styles.toolbarAlignMenuItemActive,
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(value)
              }}
            >
              <Icon className={styles.toolbarIcon} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

