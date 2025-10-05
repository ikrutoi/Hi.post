import { useRef, useEffect } from 'react'

import styles from './HeaderActions.module.scss'
import { useHeaderStatus } from '../application/hooks/useHeaderStatus'
import { applyIconStylesByStatus } from '@shared/lib/dom'
import { getToolbarIcon } from '@shared/utils/icons'
import { handleToolbarClick } from '../application/handlers/handleToolbarClick'
import type { State } from '@shared/config/theme/stateColors'

type Tooltip = 'cart' | 'clip' | 'user'
type IconRefMap = Record<string, HTMLButtonElement | null>

export const HeaderActions: React.FC = () => {
  const { status, cartCount, draftsCount } = useHeaderStatus()

  const btnIconRefs = useRef<IconRefMap>({})
  const setBtnIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    btnIconRefs.current[id] = el
  }

  const statusMapped: Record<string, State> = {
    cart: status.cart ? 'true' : 'false',
    clip: status.clip ? 'true' : 'false',
  }

  useEffect(() => {
    applyIconStylesByStatus({ status: statusMapped }, btnIconRefs.current)
  }, [statusMapped])

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) =>
    handleToolbarClick(evt, status)

  const buttons: Tooltip[] = ['cart', 'clip', 'user']

  return (
    <div className={styles.headerActions}>
      <div className={styles.headerActions__cards}>
        {buttons.map((btn) => {
          const count =
            btn === 'cart' ? cartCount : btn === 'clip' ? draftsCount : null

          return (
            <button
              key={btn}
              className={`${styles.toolbarBtn} ${styles[`toolbarBtn--${btn}`]}`}
              data-tooltip={btn}
              ref={setBtnIconRef(`status-${btn}`)}
              onClick={handleClick}
            >
              {getToolbarIcon(btn)}
              {count ? (
                <span
                  className={`${styles.counterContainer} ${styles[`${btn}CounterContainer`]}`}
                >
                  <span
                    className={`${styles.counter} ${styles[`${btn}Counter`]}`}
                  >
                    {count}
                  </span>
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      <div className={styles.headerActions__user}>
        <span className={styles.headerActions__userImg} />
      </div>
    </div>
  )
}
