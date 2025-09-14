import { cartStore } from './cartStore'

export const getAllCart = async () => {
  return await cartStore.getAll()
}
