import React, { useRef } from 'react'
import clsx from 'clsx'
import { IconAddressNext } from '@shared/ui/icons'
import { runAssemblyRecipientCycle } from '@layout/presentation/MobileAppShell/assemblyRecipientCycleBridge'
import toolbarStyles from '@toolbar/presentation/Toolbar.module.scss'
import styles from './AddressNextCycleButton.module.scss'

type AddressNextCycleButtonProps = {
  count: number
}

export const AddressNextCycleButton: React.FC<AddressNextCycleButtonProps> = ({
  count,
}) => {
  const lastFireAtRef = useRef(0)

  const fire = (event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const now = Date.now()
    if (now - lastFireAtRef.current < 280) return
    lastFireAtRef.current = now
    runAssemblyRecipientCycle()
  }

  return (
    <div className={clsx(toolbarStyles.toolbar, styles.wrap)}>
      <button
        type="button"
        className={clsx(toolbarStyles.toolbarKey, toolbarStyles.toolbarKeyEnabled)}
        data-icon-key="addressNext"
        aria-label="Next recipient"
        onPointerDown={fire}
        onClick={fire}
      >
        <IconAddressNext aria-hidden />
        {count > 1 ? (
          <span className={toolbarStyles.toolbarBadge} aria-hidden>
            <span className={toolbarStyles.toolbarBadgeValue}>{count}</span>
          </span>
        ) : null}
      </button>
    </div>
  )
}
