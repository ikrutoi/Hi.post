import React from 'react'
import styles from './AddressListRow.module.scss'

export type AddressSummaryContentProps = {
  nameLine: string
  cityCountryLine: string
}

/** Только текст упрощённой строки (имя + город/страна), без оболочки списка. */
export const AddressSummaryContent: React.FC<AddressSummaryContentProps> = ({
  nameLine,
  cityCountryLine,
}) => (
  <>
    <div className={styles.nameLine}>{nameLine}</div>
    <div className={styles.cityLine}>{cityCountryLine}</div>
  </>
)
