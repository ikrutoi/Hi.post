import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppSelector } from '@app/hooks'
import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
} from '../../utils'
import { buildMonthCells } from '../logic'
import { collectCartDatePickWaveEnabledKeysInGridOrder } from '../logic/cartDatePickWaveKeys'
import { useCalendarCellController } from '@date/cell/application/hooks'
import type {
  DispatchDate,
  CalendarViewDate,
  Switcher,
} from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'
import { useSectionMenuFacade } from '@entities/sectionEditorMenu/application/facades'
import {
  selectCartCalendarDatePickMode,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'

interface UseCalendarConstructionParams {
  firstDayOfWeek: 'Sun' | 'Mon'
  calendarViewDate: CalendarViewDate
  chooseDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

const currentDate = getCurrentDate()

/** Шаг волны подсветки при dateEdit (полоса «Корзина»). */
const CART_DATE_PICK_WAVE_MS = 100

export const useCalendarConstruction = ({
  firstDayOfWeek,
  calendarViewDate,
  chooseDate,
  triggerFlash,
}: UseCalendarConstructionParams) => {
  const { activeSection } = useSectionMenuFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cardsMap = useAppSelector(selectCardsByDateMap)
  const highlightDates = useAppSelector(selectMergedDispatchDates)
  const { year, month } = calendarViewDate

  const [waveStrongKeys, setWaveStrongKeys] = useState<string[]>([])
  const [waveFadingKey, setWaveFadingKey] = useState<string | null>(null)
  /** Актуальный список ключей волны (обновляется каждый рендер; эффект волны на него не подписан). */
  const enabledKeysWaveRef = useRef<string[]>([])
  /** Инвалидация цепочки setTimeout после cleanup. */
  const cartDatePickWaveScheduleTokenRef = useRef(0)
  /** Одна волна за «армирование» date pick; cleanup снимает — иначе Strict Mode глушит второй mount. */
  const cartDatePickWaveArmedRef = useRef(false)

  const enabledKeysGridOrderForCartWave = useMemo(() => {
    if (activeSection !== 'date' || notebookStripTab !== 'cart') return []
    return collectCartDatePickWaveEnabledKeysInGridOrder({
      calendarViewDate: { year, month },
      firstDayOfWeek,
      currentDate,
    })
  }, [activeSection, notebookStripTab, year, month, firstDayOfWeek])

  enabledKeysWaveRef.current = enabledKeysGridOrderForCartWave

  useEffect(() => {
    const isCartStrip = activeSection === 'date' && notebookStripTab === 'cart'
    const eligible = Boolean(isCartStrip && cartCalendarDatePickMode)

    if (!eligible) {
      cartDatePickWaveArmedRef.current = false
      cartDatePickWaveScheduleTokenRef.current += 1
      setWaveStrongKeys([])
      setWaveFadingKey(null)
      return
    }

    if (cartDatePickWaveArmedRef.current) {
      return
    }
    cartDatePickWaveArmedRef.current = true

    cartDatePickWaveScheduleTokenRef.current += 1
    const tokenAtMount = cartDatePickWaveScheduleTokenRef.current
    const keysSnapshot = (): string[] => [...enabledKeysWaveRef.current]

    let cancelled = false
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined
    let pollAttempts = 0

    const startOrPollKeys = () => {
      if (cancelled) return
      if (cartDatePickWaveScheduleTokenRef.current !== tokenAtMount) return
      const keys = keysSnapshot()
      if (keys.length === 0) {
        pollAttempts += 1
        if (pollAttempts > 120) return
        timeoutId = window.setTimeout(startOrPollKeys, 0)
        return
      }

      const m = keys.length
      /**
       * Линейная «змейка» по `keys` (порядок сетки): без `% m`, без возврата к началу.
       * `spentFromSnake` — ячейка уже прошла strong-фазу (уходит в fade), в strong её не ставим снова.
       */
      const totalFrames = m === 2 ? 1 : m
      let frame = 0
      const spentFromSnake = new Set<string>()

      const applyFrame = (step: number) => {
        if (m === 1) {
          setWaveStrongKeys([keys[0]])
          setWaveFadingKey(null)
          return
        }
        if (m === 2) {
          setWaveStrongKeys([keys[0], keys[1]])
          setWaveFadingKey(null)
          return
        }
        if (step === 0) {
          setWaveStrongKeys([keys[0], keys[1]])
          setWaveFadingKey(null)
          return
        }
        if (step < m - 1) {
          const outgoing = keys[step - 1]
          const a = keys[step]
          const b = keys[step + 1]
          spentFromSnake.add(outgoing)
          setWaveFadingKey(outgoing)
          setWaveStrongKeys([a, b])
          return
        }
        const outgoing = keys[m - 2]
        const last = keys[m - 1]
        spentFromSnake.add(outgoing)
        setWaveFadingKey(outgoing)
        setWaveStrongKeys([last])
      }

      const clearWaveUi = () => {
        setWaveStrongKeys([])
        setWaveFadingKey(null)
      }

      const finishWave = () => {
        if (cartDatePickWaveScheduleTokenRef.current !== tokenAtMount) return
        clearWaveUi()
      }

      const run = () => {
        if (cancelled) return
        if (cartDatePickWaveScheduleTokenRef.current !== tokenAtMount) return
        if (frame >= totalFrames) {
          finishWave()
          return
        }
        applyFrame(frame)
        frame += 1
        if (cartDatePickWaveScheduleTokenRef.current !== tokenAtMount) return
        if (frame < totalFrames) {
          timeoutId = window.setTimeout(run, CART_DATE_PICK_WAVE_MS)
        } else {
          timeoutId = window.setTimeout(() => {
            if (cancelled) return
            if (cartDatePickWaveScheduleTokenRef.current !== tokenAtMount) return
            finishWave()
          }, CART_DATE_PICK_WAVE_MS)
        }
      }

      run()
    }

    startOrPollKeys()

    return () => {
      cancelled = true
      cartDatePickWaveArmedRef.current = false
      cartDatePickWaveScheduleTokenRef.current += 1
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [cartCalendarDatePickMode, activeSection, notebookStripTab])

  const cartWaveStrongSet = useMemo(
    () => new Set(waveStrongKeys),
    [waveStrongKeys],
  )

  const daysInPrevMonth = getDaysInPreviousMonth(year, month)
  const daysInCurrMonth = getDaysInCurrentMonth(year, month)

  const offset = getFirstDayOfWeekFromDispatch(firstDayOfWeek, calendarViewDate)

  const { handleCellClickLogic } = useCalendarCellController({ triggerFlash })

  const handleClickCell = (params: HandleCellClickParams) => {
    handleCellClickLogic(params)
  }

  const prevDays = Array.from(
    { length: offset },
    (_, i) => daysInPrevMonth - i,
  ).reverse()
  const currDays = Array.from({ length: daysInCurrMonth }, (_, i) => i + 1)
  const nextDays = Array.from(
    { length: 42 - offset - daysInCurrMonth },
    (_, i) => i + 1,
  )

  const previousCells = buildMonthCells({
    days: prevDays,
    direction: 'before',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    cardsMap,
    cartDatePickWaveStrongKeys: cartWaveStrongSet,
    cartDatePickWaveFadingKey: waveFadingKey,
  })

  const currentCells = buildMonthCells({
    days: currDays,
    direction: 'current',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    chooseDate,
    cardsMap,
    cartDatePickWaveStrongKeys: cartWaveStrongSet,
    cartDatePickWaveFadingKey: waveFadingKey,
  })

  const nextCells = buildMonthCells({
    days: nextDays,
    direction: 'after',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    cardsMap,
    cartDatePickWaveStrongKeys: cartWaveStrongSet,
    cartDatePickWaveFadingKey: waveFadingKey,
  })

  return [...previousCells, ...currentCells, ...nextCells]
}
