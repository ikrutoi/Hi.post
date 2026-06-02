import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@app/state'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { restoreLocalPostcardsFromSnapshot } from '../application/services/restoreLocalPostcards'
import {
  POSTCARD_SYNC_PAYLOAD_VERSION,
  type PostcardSyncSnapshot,
} from '../domain/types/postcardSync.types'
import { getPostcardSyncRepository } from '../infrastructure'
import { rehydratePostcardsFromIdb } from './postcardSync.actions'

export const fetchCloudBackupThunk = createAsyncThunk<
  PostcardSyncSnapshot | null,
  void,
  { rejectValue: string }
>('postcardSync/fetchCloudBackup', async (_, thunkAPI) => {
  try {
    return await getPostcardSyncRepository().fetchSnapshot()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load cloud backup'
    return thunkAPI.rejectWithValue(message)
  }
})

export const uploadCloudBackupThunk = createAsyncThunk<
  PostcardSyncSnapshot,
  void,
  { rejectValue: string }
>('postcardSync/uploadCloudBackup', async (_, thunkAPI) => {
  try {
    const postcards = await postcardsAdapter.getAll()

    return await getPostcardSyncRepository().saveSnapshot({
      version: POSTCARD_SYNC_PAYLOAD_VERSION,
      exportedAt: new Date().toISOString(),
      postcards,
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to save cloud backup'
    return thunkAPI.rejectWithValue(message)
  }
})

export const restoreCloudBackupThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: string; state: RootState }
>('postcardSync/restoreCloudBackup', async (_, thunkAPI) => {
  const snapshot = thunkAPI.getState().postcardSync.cloudBackup

  if (!snapshot) {
    return thunkAPI.rejectWithValue('No cloud backup to restore')
  }

  try {
    await restoreLocalPostcardsFromSnapshot(snapshot.postcards)
    thunkAPI.dispatch(rehydratePostcardsFromIdb())
    return snapshot.postcards.length
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to restore cloud backup'
    return thunkAPI.rejectWithValue(message)
  }
})
