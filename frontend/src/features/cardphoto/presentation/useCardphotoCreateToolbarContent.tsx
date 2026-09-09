import React from 'react'
import { Toolbar } from '@/features/toolbar/presentation/Toolbar'
import { useAppSelector } from '@app/hooks'
import {
  selectActiveImage,
  selectCardphotoAssetToolbar,
  selectIsCardphotoCreateSession,
} from '@cardphoto/infrastructure/selectors'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useCardphotoCreateToolbarGroups } from './useCardphotoCreateToolbarGroups'
import styles from './Cardphoto.module.scss'

type UseCardphotoCreateToolbarContentOptions = {
  enabled: boolean
}

export function useCardphotoCreateToolbarContent({
  enabled,
}: UseCardphotoCreateToolbarContentOptions): React.ReactNode {
  const activeImage = useAppSelector(selectActiveImage)
  const assetToolbar = useAppSelector(selectCardphotoAssetToolbar)
  const isCardphotoCreateSession = useAppSelector(
    selectIsCardphotoCreateSession,
  )
  const { assemblyCardphotoSimplifiedPeek } = useMobileFactoryListChrome()
  const groupsOverride = useCardphotoCreateToolbarGroups()

  const show =
    enabled &&
    !!activeImage &&
    assetToolbar === 'cardphotoCreate' &&
    isCardphotoCreateSession &&
    !assemblyCardphotoSimplifiedPeek

  if (!show) return null

  return (
    <div className={styles.cardphotoViewToolbarRow}>
      <Toolbar section="cardphotoCreate" groupsOverride={groupsOverride} />
    </div>
  )
}
