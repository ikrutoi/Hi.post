import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import {
  RIGHT_SIDEBAR_KEYS,
  type RightSidebarKey,
} from '@toolbar/domain/types/rightSidebar.types'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type { IconState } from '@shared/config/constants'
import styles from './SectionEditorRightSidebar.module.scss'

type SectionEditorRightSidebarProps = {
  /**
   * Правый режим корзины/истории: держать cart или history active в сайдбаре,
   * даже когда peek открывает «Дата» и сага снимает подсветку.
   */
  pinActiveTab?: Extract<RightSidebarKey, 'cart' | 'history'> | null
}

export const SectionEditorRightSidebar: React.FC<
  SectionEditorRightSidebarProps
> = ({ pinActiveTab = null }) => {
  const storeState = useAppSelector(selectToolbarSectionState('rightSidebar'))

  const rightSidebarStateOverride = useMemo(() => {
    if (pinActiveTab == null) return undefined
    return Object.fromEntries(
      RIGHT_SIDEBAR_KEYS.map((key) => {
        const prev = storeState[key]
        const base =
          prev != null && typeof prev === 'object'
            ? prev
            : {
                state: ((prev as IconState | undefined) ?? 'enabled') as IconState,
                options: {},
              }
        return [
          key,
          {
            ...base,
            state:
              key === pinActiveTab ? ('active' as const) : ('enabled' as const),
          },
        ]
      }),
    )
  }, [pinActiveTab, storeState])

  return (
    <aside
      className={styles.sectionEditorRightSidebar}
      aria-label="Profile, cart, and history"
    >
      <div className={styles.toolbarSlot}>
        <Toolbar
          section="rightSidebar"
          stateOverride={rightSidebarStateOverride}
        />
      </div>
    </aside>
  )
}
