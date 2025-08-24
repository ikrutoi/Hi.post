import { sentStore } from './store'

export const getAllSent = async () => {
  return await sentStore.getAll()
}
