import { draftStore } from './store'

export const getAllDrafts = async () => {
  return await draftStore.getAll()
}
