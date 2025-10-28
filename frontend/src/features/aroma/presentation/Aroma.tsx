import React from 'react'
import { AromaTile } from './AromaTile/AromaTile'
import { aromaList } from '@entities/aroma/domain/aromaList'
import { useAromaFacade } from '../application/facades'
import styles from './Aroma.module.scss'

export const Aroma: React.FC = () => {
  const { state, actions } = useAromaFacade()
  const { selectedAroma, tileSize } = state
  const { handleSubmit, update } = actions

  return (
    <form className={styles.aroma} onSubmit={handleSubmit}>
      {aromaList
        .sort((a, b) => (a.make > b.make ? 1 : -1))
        .map((el, i) => (
          <AromaTile
            key={`${el.name}-${i}`}
            selectedAroma={selectedAroma}
            elementAroma={el}
            setSelectedAroma={update}
            tileSize={tileSize}
          />
        ))}
    </form>
  )
}
