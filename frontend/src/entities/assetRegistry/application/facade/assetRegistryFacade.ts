import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { setAsset, clearRegistry } from '../../infrastructure/state'
import { selectAssetRegistry } from '../../infrastructure/selectors'
import { ImageAsset } from '../../domain/types'

export const useAssetRegistryFacade = () => {
  const dispatch = useAppDispatch()
  const registry = useAppSelector(selectAssetRegistry)

  /** Обычная функция (без хуков): иначе условный вызов ломает порядок хуков в родителе. */
  const getAssetById = useCallback(
    (id: string | null): ImageAsset | null => {
      if (!id) return null
      return registry[id] ?? null
    },
    [registry],
  )

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
