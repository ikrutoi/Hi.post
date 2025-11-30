import { useRef } from 'react'
import clsx from 'clsx'
import { applyIconStylesByStatus } from '@shared/lib/dom'
import { getToolbarIcon } from '@shared/utils/icons'
import { SOURCES } from '@shared/config/constants'
import { useStoreCount } from '@db/hooks'
import {
  cartTemplatesAdapter,
  draftsTemplatesAdapter,
} from '@db/adapters/templateAdapters'
import styles from './HeaderActions.module.scss'

type IconRefMap = Record<string, HTMLButtonElement | null>

export const HeaderActions: React.FC = () => {
  const sourceCountMap = {
    cart: useStoreCount(cartTemplatesAdapter),
    drafts: useStoreCount(draftsTemplatesAdapter),
  }

  const btnIconRefs = useRef<IconRefMap>({})
  const setBtnIconRef = (id: string) => (el: HTMLButtonElement | null) => {
    btnIconRefs.current[id] = el
  }

  const handleClick = () => {
    // TODO: implement click logic
  }

  return (
    <div className={styles.headerActions}>
      <div className={styles.headerActions__cards}>
        {SOURCES.map((source) => {
          const count = sourceCountMap[source] ?? null

          return (
            <button
              key={source}
              className={clsx(
                styles.toolbarBtn,
                styles[`toolbarBtn--${source}`]
              )}
              data-tooltip={source}
              ref={setBtnIconRef(`status-${source}`)}
              onClick={handleClick}
            >
              {getToolbarIcon({ key: source })}
              {count ? (
                <span
                  className={clsx(
                    styles.counterContainer,
                    styles[`${source}CounterContainer`]
                  )}
                >
                  <span
                    className={clsx(styles.counter, styles[`${source}Counter`])}
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
