import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  closeDayPanel,
  setDateListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsDateListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import type { DispatchDate } from '@entities/date/domain/types'
import { CardsListPanel } from '../dayPanel/CardsListPanel'
import { DateListPanel } from './DateListPanel'
import type { DateListPanelItem } from './DateListPanel'
import styles from './DateRightSlot.module.scss'

function formatDispatchDateLabel(d: DispatchDate): string {
  const date = new Date(d.year, d.month - 1, d.day)
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const DateRightSlot: React.FC = () => {
  const dispatch = useAppDispatch()
  const openDayPanel = useAppSelector((state) => state.calendar.openDayPanel)
  const dateListOpen = useAppSelector(selectIsDateListPanelOpen)
  const mergedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const { previewUrl } = useAppSelector(selectCardphotoPreview)

  const dateListEntries: DateListPanelItem[] = useMemo(
    () =>
      mergedDispatchDates.map((d, index) => ({
        id: `${d.year}-${d.month}-${d.day}-${index}`,
        dateLabel: formatDispatchDateLabel(d),
        previewUrl: previewUrl ?? null,
        previewStatus: 'processed' as const,
      })),
    [mergedDispatchDates, previewUrl],
  )

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
