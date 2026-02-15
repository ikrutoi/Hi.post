import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageAsset } from '../../domain/types'

interface AssetRegistryState {
  images: Record<string, ImageAsset>
}

const initialState: AssetRegistryState = {
  images: {},
}

export const assetRegistrySlice = createSlice({
  name: 'assetRegistry',
  initialState,
  reducers: {
    setAsset(state, action: PayloadAction<ImageAsset>) {
      state.images[action.payload.id] = action.payload
    },

    setAssets(state, action: PayloadAction<ImageAsset[]>) {
      action.payload.forEach((asset) => {
        state.images[asset.id] = asset
      })
    },

    removeAsset(state, action: PayloadAction<string>) {
      delete state.images[action.payload]
    },

    clearRegistry(state) {
      state.images = {}
    },
  },
})

export const { setAsset, setAssets, removeAsset, clearRegistry } =
  assetRegistrySlice.actions

export default assetRegistrySlice.reducer
