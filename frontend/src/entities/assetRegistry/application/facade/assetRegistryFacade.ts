import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setAsset, clearRegistry } from '../../infrastructure/state'
import {
  selectAssetById,
  selectAssetRegistry,
} from '../../infrastructure/selectors'
import { ImageAsset } from '../../domain/types'

export const useAssetRegistryFacade = () => {
  const dispatch = useAppDispatch()
  const registry = useAppSelector(selectAssetRegistry)

  const getAssetById = (id: string | null) => {
    return useAppSelector((state) => selectAssetById(state, id))
  }

  const registerAsset = useCallback(
    (asset: ImageAsset) => {
      dispatch(setAsset(asset))
    },
    [dispatch],
  )

  const releaseAllAssets = useCallback(() => {
    const assets = Object.values(registry)

    assets.forEach((asset) => {
      if (asset.url?.startsWith('blob:')) {
        URL.revokeObjectURL(asset.url)
      }
      if (asset.thumbUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(asset.thumbUrl)
      }
    })

    dispatch(clearRegistry())
  }, [dispatch, registry])

  return {
    registry,
    getAssetById,
    registerAsset,
    releaseAllAssets,
  }
}
