import React, { useCallback, useRef } from 'react'
import clsx from 'clsx'
import { IconDateNext } from '@shared/ui/icons'
import { runAssemblyDateCycle } from '@layout/presentation/MobileAppShell/assemblyDateCycleBridge'
import toolbarStyles from '@toolbar/presentation/Toolbar.module.scss'
import styles from './AddressNextCycleButton.module.scss'

type DateNextCycleButtonProps = {
  count: number
}

export const DateNextCycleButton: React.FC<DateNextCycleButtonProps> = ({
  count,
}) => {
  const lastFireAtRef = useRef(0)

  const fire = useCallback((event: React.SyntheticEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const now = Date.now()
    if (now - lastFireAtRef.current < 280) return
    lastFireAtRef.current = now
    runAssemblyDateCycle()
  }, [])

  return (
    <div className={clsx(toolbarStyles.toolbar, styles.wrap)}>
      <button
        type="button"
        className={clsx(
          toolbarStyles.toolbarKey,
          toolbarStyles.toolbarKeyEnabled,
        )}
        data-icon-key="dateNext"
        aria-label="Next selected send day"
        onPointerDown={fire}
        onClick={fire}
      >
        <IconDateNext aria-hidden />
        {count > 1 ? (
          <span className={styles.badge} aria-hidden>
            {count}
          </span>
        ) : null}
      </button>
    </div>
  )
}
