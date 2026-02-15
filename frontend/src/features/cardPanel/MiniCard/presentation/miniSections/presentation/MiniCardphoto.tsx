import React from 'react'
import { useAppSelector } from '@app/hooks'
import clsx from 'clsx'
import styles from './MiniCardphoto.module.scss'
// import { useActiveImageUrl } from '../application/hooks'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'

export const MiniCardphoto = () => {
  const photoPreview = useAppSelector(selectCardphotoPreview)

  if (!photoPreview?.previewUrl) return null

  return (
    <img
      key={photoPreview.id}
      className={clsx(styles.miniCardphoto, styles.visible)}
      src={photoPreview.previewUrl}
      alt="MiniCard photo"
    />
  )
}

// export const MiniCardphoto1 = () => {
//   const url = useActiveImageUrl()

//   if (!url) return null

//   return (
//     <img
//       className={clsx(styles.miniCardphoto, url && styles.visible)}
//       src={url}
//       alt="MiniCard photo"
//     />
//   )
// }
