import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import {
  RIGHT_SIDEBAR_KEYS,
  RIGHT_SIDEBAR_TOOLBAR,
  type RightSidebarKey,
} from '@toolbar/domain/types/rightSidebar.types'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type { IconState } from '@shared/config/constants'
import type { ToolbarGroup } from '@toolbar/domain/types'
import styles from './SectionEditorRightSidebar.module.scss'

const MOBILE_HEADER_BAR_HIDDEN_KEYS = new Set<RightSidebarKey>([
  'cart',
  'history',
])

type SectionEditorRightSidebarProps = {
  variant?: 'sidebar' | 'headerBar'
  /**
   * Правый режим корзины/истории: держать cart или history active в сайдбаре,
   * даже когда peek открывает «Дата» и сага снимает подсветку.
   */
  pinActiveTab?: Extract<RightSidebarKey, 'cart' | 'history'> | null
}

export const SectionEditorRightSidebar: React.FC<
  SectionEditorRightSidebarProps
> = ({ variant = 'sidebar', pinActiveTab = null }) => {
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

  const groupsOverride = useMemo((): ToolbarGroup[] | undefined => {
    if (variant !== 'headerBar') return undefined
    return RIGHT_SIDEBAR_TOOLBAR.map((group) => ({
      ...group,
      icons: [...group.icons]
        .filter((icon) => !MOBILE_HEADER_BAR_HIDDEN_KEYS.has(icon.key))
        .reverse(),
    }))
  }, [variant])

  const toolbar = (
    <Toolbar
      section="rightSidebar"
      layout={variant === 'headerBar' ? 'headerBar' : undefined}
      groupsOverride={groupsOverride}
      stateOverride={rightSidebarStateOverride}
    />
  )

  if (variant === 'headerBar') {
    return (
      <div className={styles.sectionEditorRightHeaderBar} aria-hidden={false}>
        {toolbar}
      </div>
    )
  }

  return (
    <aside
      className={styles.sectionEditorRightSidebar}
      aria-label="Profile, cart, and history"
    >
      <div className={styles.toolbarSlot}>{toolbar}</div>
    </aside>
  )
}
