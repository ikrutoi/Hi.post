import React from 'react'
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

const OPTIONS: {
  value: TextAlign
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}[] = [
  { value: 'left', Icon: IconAlignLeftV3 },
  { value: 'center', Icon: IconAlignCenterV3 },
  { value: 'right', Icon: IconAlignRightV3 },
  { value: 'justify', Icon: IconAlignJustifyV3 },
]

function nextTextAlign(current: TextAlign): TextAlign {
  const index = OPTIONS.findIndex((option) => option.value === current)
  const safeIndex = index < 0 ? 0 : index
  return OPTIONS[(safeIndex + 1) % OPTIONS.length].value
}

export const CardtextAlignButton: React.FC<CardtextAlignButtonProps> = ({
  className,
  disabled,
}) => {
  const dispatch = useAppDispatch()
  const { align } = useAppSelector(selectCardtextStyle)
  const active = OPTIONS.find((option) => option.value === align) ?? OPTIONS[0]
  const ActiveIcon = active.Icon

  const handleCycle = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    const next = nextTextAlign(align)
    dispatch(setAlign(next))
    dispatch(setTextStyle({ align: next }))
  }

  return (
    <button
      type="button"
      className={className}
      data-icon-key="left"
      data-icon-state={disabled ? 'disabled' : 'enabled'}
      disabled={disabled}
      aria-label="Cycle text align"
      title="Cycle text align"
      onPointerDown={handleCycle}
    >
      <ActiveIcon className={styles.toolbarIcon} />
    </button>
  )
}
