import React from 'react'

import AromaTile from './AromaTile/AromaTile'

import styles from './Aroma.module.scss'

import { aromaList } from '@entities/aroma/domain/aromaList'
import { useAromaController } from '../application/controllers/useAromaController'

const Aroma: React.FC = () => {
  const { selectedAroma, setSelectedAroma, handleSubmit, tileSize } =
    useAromaController()

  return (
    <form className={styles.aroma} onSubmit={handleSubmit}>
      {aromaList
        .sort((a, b) => (a.make > b.make ? 1 : -1))
        .map((el, i) => (
          <AromaTile
            key={`${el.name}-${i}`}
            selectedAroma={selectedAroma}
            elementAroma={el}
            setSelectedAroma={setSelectedAroma}
            tileSize={tileSize}
          />
        ))}
    </form>
  )
}

export default Aroma
