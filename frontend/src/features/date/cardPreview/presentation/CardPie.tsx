import React from 'react'
import clsx from 'clsx'
import { useCardFacade } from '@entities/card/application/facades'
import styles from './CardPie.module.scss'

export const CardPie: React.FC = () => {
  const { previewCard, isPreviewOpen, closePreview, copyFull, copySection } =
    useCardFacade()

  if (!isPreviewOpen || !previewCard) return null

  return (
    <div className={styles.cardPie}>
      <div className={clsx(styles.cardPieContainer)}>
        <div className={clsx(styles.cardPieSector)}></div>
        <div className={clsx(styles.cardPieSector)}></div>
        <div className={clsx(styles.cardPieSector)}></div>
        <div className={clsx(styles.cardPieSector)}></div>
        <div className={clsx(styles.cardPieSector)}></div>
        <button className={styles.closeBtn} onClick={closePreview}>
          X
        </button>
      </div>
    </div>
  )
  {
    /* <div className={styles.donorModal}> */
  }
  // <div className={styles.sectionsList}>
  //   <div className={styles.sectionRow}>
  //     <img src={previewCard.thumbnailUrl} className={styles.miniThumb} />
  //     <span>Image</span>
  //     <button onClick={() => copySection(previewCard.id, 'cardphoto')}>
  //       🧲
  //     </button>
  //   </div>

  //   <div className={styles.sectionRow}>
  //     <p className={styles.textSnippet}>
  //       {/* {donor.text.content.slice(0, 20)}... */}
  //     </p>
  //     <span>Text</span>
  //     <button onClick={() => copySection(previewCard.id, 'cardtext')}>
  //       🧲
  //     </button>
  //   </div>

  //   <div className={styles.sectionRow}>
  //     <span>Address: {previewCard.envelope.recipient.data.name}</span>
  //     <button onClick={() => copySection(previewCard.id, 'envelope')}>
  //       🧲
  //     </button>
  //   </div>
  // </div>

  {
    /* <button
          className={styles.copyAllBtn}
          onClick={() => copyFull(previewCard.id)}
        >
          Copy all...
        </button> */
  }
  {
    /* </div> */
  }
}
