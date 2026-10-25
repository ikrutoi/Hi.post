import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import type { DispatchDate } from '@entities/date/domain/types'
import { dispatchPriceUsdForYearStep } from '@date/domain/dispatchPriceTable'
import {
  selectAppliedDates,
  selectDraftDispatchDates,
} from '@date/infrastructure/selectors'
import { markStampYearCountFromDispatch } from '@envelope/domain/markStampYearDigit'
import { Price } from './Price'
import styles from './AssemblyPieCornerFrame.module.scss'

type AssemblyPieCornerFrameProps = {
  /** `mini` — 50% ширины левого мини-пая, `miniMobile` — 65%. */
  size?: 'central' | 'mini' | 'miniMobile'
  /**
   * Дата отправки этой открытки.
   * Без пропа — живая дата сборки: черновик календаря, затем уже применённая.
   */
  dispatchDate?: DispatchDate | null
}

/** Знак цены на пае собранной открытки. */
export const AssemblyPieCornerFrame: React.FC<AssemblyPieCornerFrameProps> = ({
  size = 'central',
  dispatchDate,
}) => {
  const draftDates = useAppSelector(selectDraftDispatchDates)
  const appliedDates = useAppSelector(selectAppliedDates)
  const date =
    dispatchDate !== undefined
      ? dispatchDate
      : (draftDates[0] ?? appliedDates[0] ?? null)
  const amount = dispatchPriceUsdForYearStep(
    markStampYearCountFromDispatch(new Date(), date),
  )

  return (
    <div
      className={clsx(
        styles.frame,
        size === 'mini' && styles.frameMini,
        size === 'miniMobile' && styles.frameMiniMobile,
      )}
    >
      <Price className={styles.price} amount={amount} />
    </div>
  )
}
