import React from 'react'
import { AromaTile } from './AromaTile/AromaTile'
import { AROMA_LIST } from '@entities/aroma/domain/constants'
import { useAromaFacade } from '../application/facades'
import { useAromaForm } from '../application/hooks'
import styles from './Aroma.module.scss'

export const Aroma: React.FC = () => {
  const { selectedAroma, actions } = useAromaFacade()
  const { selectAroma } = actions
  const { handleSubmit } = useAromaForm()

  return (
    <form className={styles.aroma} onSubmit={handleSubmit}>
      {AROMA_LIST.sort((a, b) => (a.make > b.make ? 1 : -1)).map((el, i) => (
        <AromaTile
          key={`${el.name}-${i}`}
          selectedAroma={selectedAroma}
          aromaItem={el}
          selectAroma={selectAroma}
        />
      ))}
    </form>
  )
}
