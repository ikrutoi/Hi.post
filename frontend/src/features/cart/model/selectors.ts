import { cartStore } from './store'

export const getAllCart = async () => {
  return await cartStore.getAll()
}
