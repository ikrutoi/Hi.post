import React from 'react'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useAromaForm } from '../application/hooks'
import styles from './Aroma.module.scss'
import type { AromaItem } from '@entities/aroma/domain/types'

export const Aroma: React.FC = () => {
  const { selectedAroma, chooseAroma } = useAromaFacade()

  const { handleSubmit } = useAromaForm()

  const handleClickAroma = (aromaItem: AromaItem) => {
    chooseAroma(aromaItem)
  }

  return (
    <div className={styles.aroma}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {AROMA_LIST.map((el, i) => (
          <AromaTile
            key={`${el.name}-${i}`}
            selectedAroma={selectedAroma}
            aromaItem={el}
            onSelectAroma={handleClickAroma}
          />
        ))}
      </form>
    </div>
  )
}
