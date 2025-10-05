import React from 'react'
import styles from './MiniAroma.module.scss'

import img00 from '@/data/aroma/no-parfum.png'
import img10 from '@/data/aroma/nasomatto__black_afgano__10.png'
import img11 from '@/data/aroma/giorgio_armani__acqua_di_gio_profondo__11.png'
import img12 from '@/data/aroma/bvlgari__man_terrae_essence__12.png'
import img13 from '@/data/aroma/jean_paul_gaulier__le_beau_le_parfum__13.png'
import img14 from '@/data/aroma/christian_dior__sauvage_elixir__14.png'
import img15 from '@/data/aroma/creed__aventus__15.png'
import img20 from '@/data/aroma/viktor_&_rolf__flowerbomb_midnight__20.png'
import img21 from '@/data/aroma/versace__versace_pour_femme_dylan_blue__21.png'
import img22 from '@/data/aroma/tom_ford__costa_azurra__22.png'
import img23 from '@/data/aroma/hermes__caleche__23.png'
import img24 from '@/data/aroma/chanel__1957__24.png'
import img25 from '@/data/aroma/carolina_herrera__212__25.png'

interface MiniAromaProps {
  valueSection: {
    index: string
    name: string
  }
  heightMinicard: number
}

const aromaImages: Record<string, string> = {
  '00': img00,
  '10': img10,
  '11': img11,
  '12': img12,
  '13': img13,
  '14': img14,
  '15': img15,
  '20': img20,
  '21': img21,
  '22': img22,
  '23': img23,
  '24': img24,
  '25': img25,
}

export const MiniAroma: React.FC<MiniAromaProps> = ({
  valueSection,
  heightMinicard,
}) => {
  const imageAroma = aromaImages[valueSection.index]

  if (!imageAroma) return null

  return (
    <div className={styles.miniAroma}>
      <img
        className={styles.miniAroma__img}
        alt={valueSection.name}
        src={imageAroma}
        style={{ height: `${0.9 * heightMinicard}px` }}
      />
    </div>
  )
}
