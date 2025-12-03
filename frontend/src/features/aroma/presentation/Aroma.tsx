import React from 'react'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useAromaForm } from '../application/hooks'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

export const Aroma: React.FC = () => {
  const { state: stateAroma, actions: actionsAroma } = useAromaFacade()
  const { selectedAroma } = stateAroma
  const { chooseAroma } = actionsAroma

  const { handleSubmit } = useAromaForm()

  const handleClickAroma = (aromaItem: AromaItem) => {
    chooseAroma(aromaItem)
  }

  return (
    <form className={styles.aroma} onSubmit={handleSubmit}>
      {AROMA_LIST.sort((a, b) => (a.make > b.make ? 1 : -1)).map((el, i) => (
        <AromaTile
          key={`${el.name}-${i}`}
          selectedAroma={selectedAroma}
          aromaItem={el}
          onSelectAroma={handleClickAroma}
        />
      ))}
    </form>
  )
}
