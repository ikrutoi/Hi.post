import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getDuplicateFlags } from '@cardPanel/domain/logic/checkForDuplicateCards'
import { setFullCardPersonalId } from '@store/slices/layoutSlice'
import type { CardData } from '@cardPanel/domain/types/cardPanel.types'

export function useDuplicate(card: CardData) {
  const dispatch = useDispatch()
  const [flags, setFlags] = useState({
    addShopping: true,
    save: true,
  })

  useEffect(() => {
    const check = async () => {
      const result = await getDuplicateFlags(card)
      setFlags(result)
    }

    if (card?.aroma && card?.date) {
      check()
    }
  }, [card])

  const updatePersonalId = (source: 'shopping' | 'blanks', id: string) => {
    dispatch(setFullCardPersonalId({ [source]: id }))
  }

  return {
    flags,
    updatePersonalId,
  }
}
