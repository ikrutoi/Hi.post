import React from 'react'
import infoMain01 from '@shared/assets/info/info_main_01.jpg'
import infoMain02 from '@shared/assets/info/info_main_02.jpg'
import infoMain03 from '@shared/assets/info/info_main_03.jpg'
import infoMain04 from '@shared/assets/info/info_main_04.jpg'
import infoMain05 from '@shared/assets/info/info_main_05.jpg'
import infoMain06 from '@shared/assets/info/info_main_06.jpg'
import styles from './UserLoginPanel.module.scss'

const INFO_CELLS: ReadonlyArray<{ id: string; src: string }> = [
  { id: '01', src: infoMain01 },
  { id: '02', src: infoMain02 },
  { id: '03', src: infoMain03 },
  { id: '04', src: infoMain04 },
  { id: '05', src: infoMain05 },
  { id: '06', src: infoMain06 },
]

export const UserPanelInfo: React.FC = () => (
  <div className={styles.infoGrid} role="list" aria-label="Info">
    {INFO_CELLS.map((cell) => (
      <div key={cell.id} className={styles.infoCell} role="listitem">
        <img className={styles.infoCellImage} src={cell.src} alt="" />
      </div>
    ))}
  </div>
)
