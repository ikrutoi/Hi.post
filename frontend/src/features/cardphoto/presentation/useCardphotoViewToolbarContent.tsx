import React, { useMemo } from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
  selectCardphotoViewDismissIconKey,
} from '@cardphoto/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { CARDPHOTO_VIEW_TOOLBAR } from '@toolbar/domain/types/cardphoto.types'
import styles from './Cardphoto.module.scss'

type UseCardphotoViewToolbarContentOptions = {
  enabled: boolean
}

export function useCardphotoViewToolbarContent({
  enabled,
}: UseCardphotoViewToolbarContentOptions): React.ReactNode {
  const activeImage = useAppSelector(selectActiveImage)
  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const viewDismissIconKey = useAppSelector(selectCardphotoViewDismissIconKey)
  const viewToolbarState = useAppSelector(
    selectToolbarSectionState('cardphotoView'),
  )
  const { assemblyCardphotoSimplifiedPeek } = useMobileFactoryListChrome()

  const groupsOverride = useMemo(() => {
    if (assetToolbar === 'cardphotoView' && viewDismissIconKey === 'delete') {
      return CARDPHOTO_VIEW_TOOLBAR.map((group) =>
        group.group === 'close'
          ? {
              ...group,
              icons: [{ key: 'delete' as const, state: 'enabled' as const }],
            }
          : group,
      )
    }
    return undefined
  }, [assetToolbar, viewDismissIconKey])

  const stateOverride = useMemo(() => {
    if (
      assetToolbar === 'cardphotoView' &&
      viewDismissIconKey === 'delete' &&
      viewToolbarState?.close
    ) {
      return { delete: viewToolbarState.close }
    }
    return undefined
  }, [assetToolbar, viewDismissIconKey, viewToolbarState])

  const show =
    enabled &&
    !!activeImage &&
    assetToolbar === 'cardphotoView' &&
    !assemblyCardphotoSimplifiedPeek

  if (!show) return null

  return (
    <div className={styles.cardphotoViewToolbarRow}>
      <Toolbar
        section="cardphotoView"
        groupsOverride={groupsOverride}
        stateOverride={stateOverride}
      />
    </div>
  )
}
