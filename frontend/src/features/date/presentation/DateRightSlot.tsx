import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  closeDayPanel,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsDateListPanelOpen } from '@date/calendar/infrastructure/selectors'
import {
  selectCachedSingleDate,
  selectIsMultiDateMode,
  selectMergedDispatchDates,
} from '@date/infrastructure/selectors'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import { CardsListPanel } from '../dayPanel/CardsListPanel'
import { DateListPanel } from './DateListPanel'
import type { DateListPanelItem } from './DateListPanel'
import styles from './DateRightSlot.module.scss'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function sameDispatchDate(a: DispatchDate, b: DispatchDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}

export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  const dateListOpen = useAppSelector(selectIsDateListPanelOpen)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const isMultiDateMode = useAppSelector(selectIsMultiDateMode)
  const cachedSingleDate = useAppSelector(selectCachedSingleDate)
  const { previewUrl } = useAppSelector(selectCardphotoPreview)

  const dateListEntries: DateListPanelItem[] = useMemo(() => {
    const preview = previewUrl ?? null
    const status = 'processed' as const

    const activeRows: DateListPanelItem[] = mergedDispatchDates.map(
      (d, index) => ({
        id: `${d.year}-${d.month}-${d.day}-m-${index}`,
        dateLabel: formatDispatchDateLabel(d),
        previewUrl: preview,
        previewStatus: status,
      }),
    )

    if (
      !isMultiDateMode ||
      !cachedSingleDate ||
      mergedDispatchDates.some((d) => sameDispatchDate(d, cachedSingleDate))
    ) {
      return activeRows
    }

    const d = cachedSingleDate
    const inactiveRow: DateListPanelItem = {
      id: `${d.year}-${d.month}-${d.day}-cached-single`,
      dateLabel: formatDispatchDateLabel(d),
      previewUrl: preview,
      previewStatus: status,
      variant: 'inactive',
    }

    return [inactiveRow, ...activeRows]
  }, [
    mergedDispatchDates,
    isMultiDateMode,
    cachedSingleDate,
    previewUrl,
  ])

  const handleCloseList = useCallback(() => {
    dispatch(setDateListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  if (openDayPanel) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <CardsListPanel
            dateKey={openDayPanel.dateKey}
            dayData={openDayPanel.dayData}
            onClose={() => dispatch(closeDayPanel())}
          />
        </div>
      </div>
    )
  }

  if (dateListOpen) {
    return (
      <div className={styles.root}>
        <div className={styles.panelWrap}>
          <DateListPanel
            onClose={handleCloseList}
            entries={dateListEntries}
          />
        </div>
      </div>
    )
  }

  return null
}
