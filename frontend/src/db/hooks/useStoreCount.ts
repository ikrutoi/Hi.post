import { useEffect, useState } from 'react'
import type { StoreAdapter } from '@/db/types'

export const useStoreCount = (adapter: StoreAdapter<any>) => {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    adapter.count().then(setCount)
  }, [adapter])

  return count
}
